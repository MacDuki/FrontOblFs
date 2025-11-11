export default function ReviewHeader({
  coverImage,
  title,
  authors,
  onClose: handleClose,
  CloseIcon,
}) {
  return (
    <div className="px-5 py-3 relative backdrop-blur-sm bg-white/40 border-b border-stone-200/50 shrink-0">
      <button
        onClick={handleClose}
        className="absolute right-4 top-5 p-2 rounded-lg hover:bg-stone-900/5 transition-all group active:scale-95 z-10"
        aria-label="Cerrar"
      >
        {CloseIcon}
      </button>
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg blur-xl" />
          <img
            src={coverImage}
            alt={title}
            className="relative w-20 h-28 object-cover rounded-lg shadow-lg border border-stone-200/50"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Review
            </h2>
          </div>
          <p className="text-stone-600 text-sm line-clamp-2 font-medium pr-8">
            {title}
          </p>
          {authors && authors.length > 0 && (
            <p className="text-stone-500 text-xs mt-1 line-clamp-1">
              by {authors.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
