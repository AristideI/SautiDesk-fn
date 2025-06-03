import { useNavigate } from "react-router";

export default function Logo() {
  const navigate = useNavigate();

  function handleLogoClick() {
    navigate("/");
  }

  return (
    <button onClick={handleLogoClick}>
      <h1 className="text-2xl font-serif">SautiDesk</h1>
    </button>
  );
}
