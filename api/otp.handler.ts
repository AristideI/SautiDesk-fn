import strapi from "./strapi";
import type { IOTP, ICreaterOTP } from "types/otp.type";
import generateOtp from "helpers/generateOtp";

export const OTPHandler = {
  async createOTP(): Promise<IOTP> {
    const otpData: ICreaterOTP = {
      otp: generateOtp(),
    };

    const { data } = await strapi.post<{ data: IOTP }>("/otps", {
      data: otpData,
    });
    return data.data;
  },

  async verifyOTP(otp: string): Promise<IOTP> {
    const { data } = await strapi.get<{ data: IOTP[] }>(`/otps`, {
      params: {
        filters: {
          otp: {
            $eq: otp,
          },
        },
      },
    });

    return data.data[0];
  },

  async deleteOTP(id: string): Promise<void> {
    await strapi.delete(`/otps/${id}`);
  },
};
