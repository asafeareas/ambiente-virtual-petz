export default function Input({ label, type = "text", value, onChange, placeholder, name, autoComplete }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm text-white/80">
          {label}
        </label>
      )}
      <input
        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400/60 transition"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
      />
    </div>
  )
}


