import getAuthToken from "utils/getAuthToken";
import { UserHandler } from "./user.handler";
import { OrganisationHandler } from "./organisation.handler";
import { TicketHandler } from "./ticket.handler";
import { OpenAIHandler } from "./openAI.handler";
import { CommentHandler } from "./comment.handler";
import { SmsHandler } from "./sms.handler";
import { AgentHandler } from "./agent.handler";
import { ConversationHandler } from "./conversation.handler";
import { NotificationHandler } from "./notification.handler";

export const authHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

export const API = {
  userHandler: UserHandler,
  organisationHandler: OrganisationHandler,
  ticketHandler: TicketHandler,
  openAIHandler: OpenAIHandler,
  commentHandler: CommentHandler,
  smsHandler: SmsHandler,
  agentHandler: AgentHandler,
  conversationHandler: ConversationHandler,
  notificationHandler: NotificationHandler,
};
