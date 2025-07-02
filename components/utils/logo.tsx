import { useNavigate } from "react-router";

export default function Logo({
  isSmall,
  notClickable,
}: {
  isSmall?: boolean;
  notClickable?: boolean;
}) {
  const navigate = useNavigate();

  function handleLogoClick() {
    navigate("/");
  }

  return (
    <button onClick={notClickable ? undefined : handleLogoClick}>
      <img
        src="/logo.png"
        alt="main Logo"
        className={`object-contain ${isSmall ? "w-24" : "w-36"}`}
      />
    </button>
  );
}
export function LogoIcon() {
  const navigate = useNavigate();

  function handleLogoClick() {
    navigate("/");
  }

  return (
    <button onClick={handleLogoClick} className="">
      <img src="/logoIcon.png" alt="main Logo" className="object-contain w-8" />
    </button>
  );
}
