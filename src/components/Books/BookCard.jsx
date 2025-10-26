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
    <div className="flex flex-col items-start">
      <div
        className="book-card bg-gray-800 rounded-2xl 
  shadow-xl overflow-hidden cursor-pointer 
  hover:scale-105 transition-all duration-300 h-52 w-34 relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${getCoverImage(info)})`,
        }}
        onClick={onClick}
      ></div>

      <div className="space-y-2 flex flex-col items-start ">
        <label
          className="px-2 py-1 
       text-xs font-semibold inline-block line-clamp-2 text-center"
        >
          {info.title}
        </label>
        <label
          className="px-2 py-1 
      text-xs font-medium inline-block text-center"
        >
          {info.authors?.join(", ") || "Unknown Author"}
        </label>
        {info.publishedDate && (
          <label
            className=" px-2 py-1 
        text-xs font-medium inline-block text-center"
          >
            {new Date(info.publishedDate).getFullYear()}
          </label>
        )}
      </div>
    </div>
  );
}
