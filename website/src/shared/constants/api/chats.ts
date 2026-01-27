export const CHATS_API_CONSTANT = {
  chats: "messages/conversations/",
  userConversations: "messages/conversations/user/",
  companyConversations: "messages/conversations/company/",
  message: (user: any) =>
    `messages/user/${user.userId}/otherUser/${user.otherId}`,
  companyUserMessage: (companyId: string, userId: string) =>
    `messages/company/${companyId}/user/${userId}`,
};
