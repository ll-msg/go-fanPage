import { useNavigate } from "react-router-dom";

export default function HeaderButton({ description, target }) {
  const navigate = useNavigate();
  const handleClick = () => {
    // Strip leading slashes so "/magazine" doesn't become "//magazine",
    // which the browser reads as an external host.
    navigate(`/${target.replace(/^\/+/, "")}`);
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors leading-none hover:text-white"
    >
      {description}
    </button>
  );
}