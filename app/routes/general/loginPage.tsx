import Button from "components/utils/button";
import Logo from "components/utils/logo";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuthContext } from "store/auth.context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { login } = useAuthContext();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateUserInfo()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      const user = await login({ identifier: email, password });
      if (user?.userRole === "ADMIN") {
        navigate("/o/organisations");
      } else {
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      setLoginError("Invalid email or password, please try again!");
      toast.error("An error occurred. Please try again later");
    } finally {
      setIsLoading(false);
    }
  }

  function validateUserInfo() {
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    if (!isValid) {
      toast.error("Please fill in all required fields");
    }

    return isValid;
  }

  return (
    <article className="flex justify-between h-screen text-white">
      <AuthLeftSection />
      <article className="w-1/2 h-full padd py-12 flex flex-col justify-between">
        <section className="h-1 "></section>
        <section className="flex flex-col gap-10 padd">
          <section className="flex flex-col gap-4 w-full">
            <p className="font-bold text-2xl">Login to your account</p>
            <p>Enter your email and password to login your account</p>
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <label htmlFor="email" className="flex flex-col gap-1">
                {/* <p className="font-semibold">Email</p> */}
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
              <label
                htmlFor="password"
                className="flex flex-col gap-1 relative"
              >
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
              {loginError && (
                <p className="text-red-600 text-sm">{loginError}</p>
              )}
              <Button
                buttonText="Login"
                onPress={() => {}}
                variant="primary"
                className="cursor-pointer"
                fullWidth
                isLoading={isLoading}
              />
            </form>
            <section className="flex justify-between items-center">
              <Link to="/register" className="hover:underline text-sm">
                Go to create
              </Link>
              <Link to="/reset-password" className="hover:underline text-sm">
                Forgot password
              </Link>
            </section>
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
            in one place. Log in to continue or create an account to get started
            with seamless support.
          </p>
          <p className="font-serif">SautiDesk &#169; 2025</p>
        </div>
      </div>
    </section>
  );
}
