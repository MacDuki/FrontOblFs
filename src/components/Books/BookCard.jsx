export default function BookCard({ book, onClick }) {
  const info = book.volumeInfo;

  const getCoverImage = (info) => {
    const img = info.imageLinks;
    if (!img) return "https://via.placeholder.com/300x450?text=No+Cover";
    return (
      img.extraLarge ||
      img.large ||
      img.medium ||
      img.thumbnail ||
      img.smallThumbnail
    );
  };

  return (
    <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] animate-[slideIn_0.5s_ease_forwards] cursor-pointer">
      <img
        src={getCoverImage(info)}
        alt={info.title || "Book cover"}
        className="w-full h-64 object-cover rounded-2xl mb-4"
        onClick={onClick}
      />
      <div className="w-full">
        <h3 className="font-semibold text-center mb-2 text-base text-white">
          {info.title}
        </h3>
        <p className="text-sm text-white/70 text-center">
          {info.authors?.join(", ") || "Unknown Author"}
        </p>
        {info.publishedDate && (
          <p className="text-xs text-white/70 text-center mt-1">
            {new Date(info.publishedDate).getFullYear()}
          </p>
        )}
      </div>
    </div>
  );
}
