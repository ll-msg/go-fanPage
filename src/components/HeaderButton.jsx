import { useNavigate } from "react-router-dom";

export default function HeaderButton({ description, target }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/${target}`)
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