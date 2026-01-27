import { ChatMessage } from "@/shared/types/chats";
import { apiSlice } from "./apiSlice";
import { CHATS_API_CONSTANT } from "@/shared/constants/api/chats"; // Adjust the path as necessary

export const conversationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get conversations for user (legacy - for backward compatibility)
    getConversations: builder.query<any[], string>({
      query: (userId) => `${CHATS_API_CONSTANT.chats}${userId}`, // Construct the full URL
    }),
    
    // Get conversations for user (new endpoint)
    getUserConversations: builder.query<any[], string>({
      query: (userId) => `${CHATS_API_CONSTANT.userConversations}${userId}`,
    }),
    
    // Get conversations for company
    getCompanyConversations: builder.query<any[], string>({
      query: (companyId) => `${CHATS_API_CONSTANT.companyConversations}${companyId}`,
    }),
    
    // Get messages between users (legacy)
    getAllMessages: builder.query<ChatMessage[], any>({
      query: (chater) => CHATS_API_CONSTANT.message(chater), // Construct the full URL
    }),
    
    // Get messages between company and user
    getCompanyUserMessages: builder.query<ChatMessage[], { companyId: string; userId: string }>({
      query: ({ companyId, userId }) => CHATS_API_CONSTANT.companyUserMessage(companyId, userId),
    }),
  }),
});

// Export hooks for the endpoints
export const { 
  useGetConversationsQuery, 
  useGetUserConversationsQuery,
  useGetCompanyConversationsQuery,
  useGetAllMessagesQuery,
  useGetCompanyUserMessagesQuery
} = conversationsApiSlice;

export default conversationsApiSlice;
