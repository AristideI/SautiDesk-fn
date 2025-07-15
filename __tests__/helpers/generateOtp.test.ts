import generateOtp from "../../helpers/generateOtp";
import { describe, it, expect } from "@jest/globals";

describe("generateOtp", () => {
  it("should generate a 6-digit OTP string", () => {
    const otp = generateOtp();

    expect(otp).toBeDefined();
    expect(typeof otp).toBe("string");
    expect(otp.length).toBe(6);
    expect(/^\d{6}$/.test(otp)).toBe(true);
  });

  it("should generate different OTPs on multiple calls", () => {
    const otp1 = generateOtp();
    const otp2 = generateOtp();
    const otp3 = generateOtp();

    expect(otp1).not.toBe(otp2);
    expect(otp2).not.toBe(otp3);
    expect(otp1).not.toBe(otp3);
  });

  it("should generate OTPs between 100000 and 999999", () => {
    const otp = generateOtp();
    const otpNumber = parseInt(otp, 10);

    expect(otpNumber).toBeGreaterThanOrEqual(100000);
    expect(otpNumber).toBeLessThanOrEqual(999999);
  });
});
