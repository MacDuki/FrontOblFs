export default function BookCard({ book }) {
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
    <div className="book-card bg-gray-800 rounded-2xl shadow-xl p-3 flex flex-col cursor-pointer hover:scale-105 transition-all duration-300">
      <div className="cover-wrap mb-4 w-full h-72">
        <img
          src={getCoverImage(info)}
          alt={info.title}
          loading="lazy"
          className="book-cover w-full h-full object-cover rounded-xl shadow-md"
        />
      </div>
      <h3 className="book-title font-semibold text-lg line-clamp-2 mb-1 text-white">
        {info.title}
      </h3>
      <p className="book-authors text-sm text-gray-300">
        {info.authors?.join(", ") || "Unknown Author"}
      </p>
    </div>
  );
}
