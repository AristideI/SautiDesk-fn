import strapi from "./strapi";
import getAuthToken from "utils/getAuthToken";
export const SmsHandler = {
  async sendSMS(to: string, message: string) {
    const authToken = await getAuthToken();
    const { data } = await strapi.post(
      "/sms",
      { to, message },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return data;
  },

  async sendMail(to: string, subject: string, body: string) {
    const authToken = await getAuthToken();
    const { data } = await strapi.post(
      "/sms/mail",
      { to, subject, body },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return data;
  },
};
