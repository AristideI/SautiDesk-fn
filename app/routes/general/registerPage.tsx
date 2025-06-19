import Button from "components/utils/button";
import Logo from "components/utils/logo";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

type RegistrationStep = "email" | "otp" | "password";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();

  async function handleOTP() {
    if (!email) {
      setEmailError("Email is required");
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep("otp");
      toast.success("OTP sent to your email");
    } catch (e) {
      console.log(e);
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  }

  async function validateOTP() {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setOtpError("Please enter 6-digit code");
      toast.error("Please enter complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP validation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep("password");
      toast.success("OTP verified successfully");
    } catch (e) {
      console.log(e);
      toast.error("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister() {
    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate registration
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (e) {
      console.log(e);
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  function validatePasswordForm() {
    let isValid = true;

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    if (!isValid) {
      toast.error("Please fix the errors above");
    }

    return isValid;
  }

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  }

  function resendOTP() {
    toast.info("Resending OTP...");
    // Simulate resending OTP
  }

  function goBack() {
    if (currentStep === "otp") {
      setCurrentStep("email");
    } else if (currentStep === "password") {
      setCurrentStep("otp");
    }
  }

  return (
    <article className="flex justify-between h-screen text-white">
      <AuthLeftSection />
      <article className="w-1/2 h-full padd py-12 flex flex-col justify-between">
        <section className="h-1"></section>
        <section className="flex flex-col gap-10 padd">
          <section className="flex flex-col gap-4 w-full">
            {currentStep !== "email" && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-sm hover:underline w-fit"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}

            {currentStep === "email" && (
              <>
                <p className="font-bold text-2xl">Create Account</p>
                <p>Enter your email below to create your account</p>
                <form
                  className="flex flex-col gap-4 w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleOTP();
                  }}
                >
                  <label htmlFor="email" className="flex flex-col gap-1">
                    <input
                      type="email"
                      placeholder="johndoe@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmailError("");
                        setEmail(e.target.value);
                      }}
                      className={`border border-dark-green rounded-lg p-2 w-full outline-none ${
                        emailError
                          ? "border-red-500 text-red-600"
                          : "border-dark-green"
                      }`}
                    />
                    {emailError && (
                      <p className="text-red-600 text-sm">{emailError}</p>
                    )}
                  </label>
                  <Button
                    buttonText="Continue"
                    onPress={handleOTP}
                    variant="primary"
                    className="cursor-pointer"
                    fullWidth
                    isLoading={isLoading}
                  />
                </form>
                <section className="flex justify-center">
                  <Link to="/login" className="hover:underline text-sm">
                    Has an account? Go To Login
                  </Link>
                </section>
              </>
            )}

            {currentStep === "otp" && (
              <>
                <p className="font-bold text-2xl">Verification Code</p>
                <p>
                  Check your email, we will send you a code to complete the
                  verification
                </p>
                <form
                  className="flex flex-col gap-4 w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validateOTP();
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center border border-dark-green rounded-lg outline-none text-lg"
                        />
                      ))}
                    </div>
                    {otpError && (
                      <p className="text-red-600 text-sm text-center">
                        {otpError}
                      </p>
                    )}
                  </div>
                  <Button
                    buttonText="Continue"
                    onPress={validateOTP}
                    variant="primary"
                    className="cursor-pointer"
                    fullWidth
                    isLoading={isLoading}
                  />
                </form>
                <section className="flex justify-center">
                  <button
                    onClick={resendOTP}
                    className="hover:underline text-sm"
                  >
                    Didn&apos;t receive the code? Resend OTP
                  </button>
                </section>
              </>
            )}

            {currentStep === "password" && (
              <>
                <p className="font-bold text-2xl">Create Password</p>
                <p>Please enter a password to secure your account</p>
                <form
                  className="flex flex-col gap-4 w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                  }}
                >
                  <label className="flex flex-col gap-1 relative">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPasswordError("");
                        setPassword(e.target.value);
                      }}
                      className={`border border-dark-green rounded-lg p-2 w-full outline-none ${
                        passwordError ? "border-red-500 text-red-600" : ""
                      }`}
                    />
                    {passwordError && (
                      <p className="text-red-600 text-sm">{passwordError}</p>
                    )}
                    <div
                      className="cursor-pointer"
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                    >
                      <div className="absolute top-[25%] right-3">
                        {isPasswordVisible ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </div>
                    </div>
                  </label>
                  <label className="flex flex-col gap-1 relative">
                    <input
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPasswordError("");
                        setConfirmPassword(e.target.value);
                      }}
                      className={`border border-dark-green rounded-lg p-2 w-full outline-none ${
                        confirmPasswordError
                          ? "border-red-500 text-red-600"
                          : ""
                      }`}
                    />
                    {confirmPasswordError && (
                      <p className="text-red-600 text-sm">
                        {confirmPasswordError}
                      </p>
                    )}
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setIsConfirmPasswordVisible((prev) => !prev)
                      }
                    >
                      <div className="absolute top-[25%] right-3">
                        {isConfirmPasswordVisible ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </div>
                    </div>
                  </label>
                  <Button
                    buttonText="Register with Email"
                    onPress={handleRegister}
                    variant="primary"
                    className="cursor-pointer"
                    fullWidth
                    isLoading={isLoading}
                  />
                </form>
              </>
            )}
          </section>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-white" />
            <p className="text-sm">OR CONTINUE WITH</p>
            <div className="flex-1 h-px bg-white" />
          </div>
          <section className="flex flex-col gap-4">
            <Button
              buttonText="Google"
              onPress={() => {}}
              variant="secondary"
              className="text-white border-white w-full"
              icon={
                <img
                  src="/icons/google.png"
                  alt="Google Icon"
                  className="w-4 h-4 object-contain"
                />
              }
            />
            <Button
              buttonText="Facebook"
              onPress={() => {}}
              variant="secondary"
              className="text-white border-white w-full"
              icon={
                <img
                  src="/icons/facebook.png"
                  alt="FaceBook Icon"
                  className="w-4 h-4 object-contain"
                />
              }
            />
          </section>
          <p className="text-center">
            By clicking continue, you agree to our <br />
            <Link to="terms" className="underline">
              Terms of use
            </Link>{" "}
            and{" "}
            <Link to="privacy-policy" className="underline">
              Privacy Policy
            </Link>
          </p>
        </section>
        <section className="h-1"></section>
      </article>
    </article>
  );
}

export function AuthLeftSection() {
  return (
    <section className="w-1/2 bg-cover h-full relative border-r border-green/30">
      <img
        src="/l1.webp"
        alt="login image"
        className="w-full h-full object-cover object-left top-0 left-0"
      />
      <div className="bg-black absolute w-full h-full top-0 left-0 opacity-90"></div>
      <div className="w-full h-full absolute top-0 left-0 padd py-12 flex flex-col justify-between">
        <Logo />
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-bold">Welcome to Sauti Desk</p>
          <p className="">
            Sauti Desk is your unified platform for managing support tickets,
            communication, and knowledge sharing. Whether you&apos;re an
            organization owner, team member, or client, everything you need is
            in one place.
            Log in to continue or create an account to get started with seamless
            support.
          </p>
          <p className="font-serif">SautiDesk &#169; 2025</p>
        </div>
      </div>
    </section>
  );
}
