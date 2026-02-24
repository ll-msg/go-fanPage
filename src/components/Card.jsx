export default function Card({ step, title, description, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg transition">
      
      {icon && (
        <div className="text-2xl mb-3 text-white">
          {icon}
        </div>
      )}

      {step && (
        <div className="text-white/40 text-sm mb-2">
          {step}
        </div>
      )}

      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>

      <p className="text-white/60">
        {description}
      </p>

    </div>
  );
}