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
import { KnowledgeBaseHandler } from "./knowledgeBase.handler";
import { astraHandler } from "./astra.handler";
import { OTPHandler } from "./otp.handler";
import { ActivityHandler } from "./activity.handler";
import { NoteHandler } from "./note.handler";

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
  knowledgeBaseHandler: KnowledgeBaseHandler,
  astraHandler: astraHandler,
  otpHandler: OTPHandler,
  activityHandler: ActivityHandler,
  noteHandler: NoteHandler,
};
