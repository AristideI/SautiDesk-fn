import { useNavigate } from "react-router";

export default function Logo() {
  const navigate = useNavigate();

  function handleLogoClick() {
    navigate("/");
  }

  return (
    <button onClick={handleLogoClick} className="">
      <img src="/logo.png" alt="main Logo" className="object-contain w-40" />
    </button>
  );
}
