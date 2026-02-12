import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type Meeting = {
    id : Nat;
    title : Text;
    description : Text;
    owner : Principal;
  };

  public type Message = {
    sender : Principal;
    recipient : Principal;
    subject : Text;
    content : Text;
  };

  public type Document = {
    owner : Principal;
    name : Text;
    blob : Storage.ExternalBlob;
  };

  public type Notice = {
    id : Nat;
    title : Text;
    content : Text;
    createdAt : Int;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextMeetingId = 0;
  let meetings = Map.empty<Nat, Meeting>();
  let messages = List.empty<Message>();
  let documents = Map.empty<Principal, List.List<Document>>();
  var nextNoticeId = 0;
  let notices = Map.empty<Nat, Notice>();

  // Registration (unchanged)
  public shared ({ caller }) func register(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous users cannot register");
    };

    if (userProfiles.containsKey(caller)) {
      Runtime.trap("This user is already registered. Use saveCallerUserProfile to update your record");
    };

    userProfiles.add(caller, profile);
    AccessControl.assignRole(accessControlState, caller, caller, #user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getAllMembers() : async [(Principal, UserProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all members");
    };
    userProfiles.toArray();
  };

  public query ({ caller }) func getMemberCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can see member count");
    };
    userProfiles.size();
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Meetings Area
  public shared ({ caller }) func createMeeting(title : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can create meetings");
    };

    let meeting : Meeting = {
      id = nextMeetingId;
      title;
      description;
      owner = caller;
    };
    meetings.add(nextMeetingId, meeting);
    nextMeetingId += 1;
  };

  public query ({ caller }) func getMeetings() : async [Meeting] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get meetings");
    };
    meetings.values().toArray();
  };

  // Messages Area
  public shared ({ caller }) func sendMessageByUsername(recipientName : Text, subject : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let recipient = findRecipientByName(recipientName);

    let message : Message = {
      sender = caller;
      recipient;
      subject;
      content;
    };
    messages.add(message);
  };

  func findRecipientByName(name : Text) : Principal {
    let entries = userProfiles.toArray();
    switch (entries.find(func((_, u)) { u.name == name })) {
      case (?entry) { entry.0 };
      case (null) { Runtime.trap("User not found") };
    };
  };

  public query ({ caller }) func getInbox() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inbox");
    };
    messages.filter(func(m) { m.recipient == caller }).toArray();
  };

  public query ({ caller }) func getSentMessages() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sent messages");
    };
    messages.filter(func(m) { m.sender == caller }).toArray();
  };

  public query ({ caller }) func getAllUsernames() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view usernames");
    };

    let entries = userProfiles.toArray();
    let usernames = entries.map(func((_, profile)) { profile.name });
    usernames;
  };

  // Document Vault Area
  public shared ({ caller }) func uploadDocument(name : Text, blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload documents");
    };
    let newDocument : Document = {
      owner = caller;
      name;
      blob;
    };
    switch (documents.get(caller)) {
      case (null) {
        let docList = List.empty<Document>();
        docList.add(newDocument);
        documents.add(caller, docList);
      };
      case (?docList) { docList.add(newDocument) };
    };
  };

  public query ({ caller }) func listDocuments() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list documents");
    };

    switch (documents.get(caller)) {
      case (null) { [] };
      case (?docList) {
        docList.map<Document, Text>(func(doc) { doc.name }).toArray();
      };
    };
  };

  public query ({ caller }) func downloadDocument(name : Text) : async ?Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can download documents");
    };

    switch (documents.get(caller)) {
      case (null) { null };
      case (?docList) {
        switch (docList.find(func(doc) { doc.name == name })) {
          case (?doc) { ?doc.blob };
          case (null) { null };
        };
      };
    };
  };

  public shared ({ caller }) func deleteDocument(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete documents");
    };

    switch (documents.get(caller)) {
      case (null) { () };
      case (?docList) {
        let newDocList = docList.filter(func(doc) { doc.name != name });
        if (newDocList.size() == 0) {
          documents.remove(caller);
        } else {
          documents.add(caller, newDocList);
        };
      };
    };
  };

  // Notice Board Component
  public shared ({ caller }) func createNotice(title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users (members) can create notices");
    };
    let notice : Notice = {
      id = nextNoticeId;
      title;
      content;
      createdAt = 0;
    };
    notices.add(nextNoticeId, notice);
    nextNoticeId += 1;
  };

  public query ({ caller }) func getAllNotices() : async [Notice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notices");
    };
    notices.values().toArray();
  };

  public shared ({ caller }) func deleteNotice(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can delete notices");
    };
    notices.remove(id);
  };
};
