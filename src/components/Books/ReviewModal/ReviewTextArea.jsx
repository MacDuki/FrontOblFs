export default function ReviewTextArea({
  id = "review-text",
  value,
  onChange,
  placeholder,
  rows = 3,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-stone-900 mb-3 tracking-wide uppercase"
      >
        Your Thoughts
        <span className="text-stone-500 font-normal normal-case ml-2 text-xs">
          (optional)
        </span>
      </label>
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200/50 focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-5 py-4 bg-transparent border-none focus:outline-none resize-none transition text-stone-800 placeholder:text-stone-400 text-[15px] leading-relaxed"
        />
        <div className="flex justify-between items-center px-5 py-3 border-t border-stone-200/50 bg-stone-50/50">
          <p className="text-xs text-stone-500 font-medium">
            {value.length} characters
          </p>
          {value.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Writing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
