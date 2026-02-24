export default function HeaderButton({ description, target }) {
  const handleClick = () => {
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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