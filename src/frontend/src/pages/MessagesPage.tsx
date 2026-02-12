import { useState, useMemo } from 'react';
import { useGetInbox, useSendMessageByUsername, useGetAllUsernames } from '../hooks/useQueries';
import { MessageSquare, Send, User, Loader2, AlertCircle, Mail, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function MessagesPage() {
  const { data: inbox, isLoading, error } = useGetInbox();
  const { data: usernames, isLoading: usernamesLoading } = useGetAllUsernames();
  const sendMessage = useSendMessageByUsername();

  const [recipientName, setRecipientName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [validationError, setValidationError] = useState('');
  const [open, setOpen] = useState(false);

  // Filter usernames based on input
  const filteredUsernames = useMemo(() => {
    if (!usernames) return [];
    if (!recipientName) return usernames;
    return usernames.filter(name => 
      name.toLowerCase().includes(recipientName.toLowerCase())
    );
  }, [usernames, recipientName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!recipientName.trim() || !subject.trim() || !content.trim()) {
      setValidationError('All fields are required');
      return;
    }

    // Check if username exists
    if (!usernames?.includes(recipientName.trim())) {
      setValidationError(`User "${recipientName.trim()}" not found. Please select a valid username from the list.`);
      return;
    }

    // Check for exact match (case-sensitive)
    const exactMatches = usernames.filter(name => name === recipientName.trim());
    if (exactMatches.length === 0) {
      setValidationError(`Username "${recipientName.trim()}" not found. Usernames are case-sensitive.`);
      return;
    }

    try {
      await sendMessage.mutateAsync({
        recipientName: recipientName.trim(),
        subject: subject.trim(),
        content: content.trim(),
      });
      setRecipientName('');
      setSubject('');
      setContent('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
      if (err.message?.includes('User not found')) {
        setValidationError('User not found. Please select a valid username.');
      } else {
        setValidationError(err.message || 'Failed to send message');
      }
    }
  };

  if (isLoading || usernamesLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
    const isAuthError = errorMessage.includes('Unauthorized') || errorMessage.includes('permission');
    
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-destructive/30 rounded-xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <h2 className="text-2xl font-bold text-destructive">
              {isAuthError ? 'Access Denied' : 'Error Loading Messages'}
            </h2>
          </div>
          <p className="text-foreground/70">
            {isAuthError 
              ? 'You do not have permission to access messages. Please ensure you are signed in with a registered account.'
              : errorMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/30 rounded-xl shadow-2xl p-8">
        <div className="flex items-center gap-4">
          <div className="bg-gold p-4 rounded-full">
            <MessageSquare className="w-8 h-8 text-carbon" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gold">Messages</h1>
            <p className="text-foreground/60 text-lg mt-1">Send and receive secure messages</p>
          </div>
        </div>
      </div>

      {/* Compose Message Form */}
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 p-6">
          <h2 className="text-2xl font-bold text-gold flex items-center gap-2">
            <Send className="w-6 h-6" />
            Compose Message
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="recipient" className="text-foreground/80">Recipient Username *</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between mt-2 bg-carbon-dark/50 border-gold/20 text-foreground hover:bg-carbon-dark/70 hover:text-foreground"
                >
                  {recipientName || "Select or type a username..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-carbon-dark border-gold/30" align="start">
                <Command className="bg-carbon-dark">
                  <CommandInput 
                    placeholder="Search usernames..." 
                    value={recipientName}
                    onValueChange={setRecipientName}
                    className="text-foreground"
                  />
                  <CommandList>
                    <CommandEmpty className="text-foreground/60 py-6 text-center text-sm">
                      No users found.
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredUsernames.map((username) => (
                        <CommandItem
                          key={username}
                          value={username}
                          onSelect={(currentValue) => {
                            setRecipientName(currentValue);
                            setOpen(false);
                            setValidationError('');
                          }}
                          className="text-foreground hover:bg-gold/10 cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4 text-gold" />
                          {username}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-foreground/50 mt-1">
              Select a registered user to send a message
            </p>
          </div>

          <div>
            <Label htmlFor="subject" className="text-foreground/80">Subject *</Label>
            <Input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Message subject"
              required
              className="mt-2 bg-carbon-dark/50 border-gold/20 text-foreground"
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-foreground/80">Message *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              required
              className="mt-2 bg-carbon-dark/50 border-gold/20 text-foreground"
            />
          </div>

          <Button
            type="submit"
            disabled={sendMessage.isPending || !recipientName.trim() || !subject.trim() || !content.trim()}
            className="w-full bg-gold hover:bg-gold-light text-carbon font-semibold"
          >
            {sendMessage.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>

          {(validationError || sendMessage.isError) && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
              {validationError || 'Failed to send message. Please try again.'}
            </div>
          )}

          {sendMessage.isSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-500 text-sm">
              Message sent successfully!
            </div>
          )}
        </form>
      </div>

      {/* Inbox */}
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 p-6">
          <h2 className="text-2xl font-bold text-gold">Inbox</h2>
          <p className="text-foreground/60 text-sm mt-1">
            {inbox?.length || 0} message{inbox?.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="p-6">
          {!inbox || inbox.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gold/30 mx-auto mb-4" />
              <p className="text-foreground/60 text-lg">No messages yet</p>
              <p className="text-foreground/40 text-sm mt-2">Your inbox is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inbox.map((message, index) => (
                <div
                  key={index}
                  className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-6 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-semibold text-gold">{message.subject}</h3>
                  </div>
                  <div className="text-foreground/70 text-sm whitespace-pre-wrap mb-4 bg-carbon-darker/50 p-4 rounded border border-gold/10">
                    {message.content}
                  </div>
                  <div className="flex items-center gap-2 text-foreground/50 text-xs">
                    <User className="w-4 h-4" />
                    <span className="font-semibold">From:</span>
                    <span className="font-mono">{message.sender.toString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
