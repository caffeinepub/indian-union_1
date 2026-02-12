import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Meeting, Message, ExternalBlob, Notice } from '../backend';
import type { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRegister() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.register(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin check hook
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Members hooks (admin-only)
export function useGetMemberCount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['memberCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMemberCount();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllMembers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['allMembers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllMembers();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Meetings hooks
export function useGetMeetings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Meeting[]>({
    queryKey: ['meetings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMeetings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateMeeting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description }: { title: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMeeting(title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

// Messages hooks
export function useGetInbox() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['inbox'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getInbox();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllUsernames() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['allUsernames'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllUsernames();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSendMessageByUsername() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipientName, subject, content }: { recipientName: string; subject: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessageByUsername(recipientName, subject, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
}

// Document Vault hooks
export function useListDocuments() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listDocuments();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUploadDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, blob }: { name: string; blob: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadDocument(name, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDownloadDocument() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (name: string): Promise<{ blob: ExternalBlob; name: string }> => {
      if (!actor) throw new Error('Actor not available');
      const blob = await actor.downloadDocument(name);
      if (!blob) {
        throw new Error('Document not found');
      }
      return { blob, name };
    },
  });
}

export function useDeleteDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDocument(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// Notice Board hooks
export function useGetAllNotices() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Notice[]>({
    queryKey: ['notices'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllNotices();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateNotice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNotice(title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
}

export function useDeleteNotice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNotice(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
}
