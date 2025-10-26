import OptionsMinimizedBook from "./OptionsMinimizedBook";
export default function BookCard({ book, onClick }) {
  const info = book.volumeInfo;

  const getCoverImage = (info) => {
    const img = info?.imageLinks;
    if (!img) return "https://via.placeholder.com/300x450?text=No+Cover";

    return (
      img.extraLarge ||
      img.large ||
      img.medium ||
      img.small ||
      img.thumbnail ||
      img.smallThumbnail
    );
  };
  // Opciones personalizadas para los libros
  const bookOptions = [
    {
      id: "favorite",
      icon: "❤️",
      label: "Agregar a favoritos",
      position: "top",
    },
    {
      id: "add-to-section",
      icon: "📚",
      label: "add to section",
      position: "right",
    },
    { id: "share", icon: "🔗", label: "Compartir", position: "bottom" },
    { id: "info", icon: "ℹ️", label: "Ver detalles", position: "left" },
  ];

  const handleOptionClick = (option, book) => {
    console.log(
      `Opción ${option.id} clickeada para el libro:`,
      book.volumeInfo.title,
      "id:",
      book.id
    );

    switch (option.id) {
      case "favorite":
        // Lógica para agregar a favoritos
        break;
      case "add-to-section":
        // Lógica para leer después
        break;
      case "share":
        // Lógica para compartir
        break;
      case "info":
        // Mostrar información adicional o ir a detalles

        break;
      default:
        break;
    }
  };
  return (
    <div className="flex flex-col items-start">
      <OptionsMinimizedBook
        key={book.id}
        options={bookOptions}
        onOptionClick={(option) => handleOptionClick(option, book)}
      >
        <div
          className="book-card bg-gray-800 rounded-xl 
  shadow-xl overflow-hidden cursor-pointer 
  hover:scale-105 transition-all duration-300 h-52 w-34 relative bg-cover bg-center"
          style={{
            backgroundImage: `url(${getCoverImage(info)})`,
          }}
          onClick={onClick}
        ></div>
      </OptionsMinimizedBook>
      <div className="space-y-2 flex flex-col items-start ">
        <label
          className="px-2 py-1 m-0 text-md font-semibold inline-block 
  text-left truncate w-[166px] overflow-hidden whitespace-nowrap"
        >
          {info.title}
        </label>

        <label
          className="px-2 m-0
      text-xs inline-block text-left"
        >
          {info.authors?.join(", ") || "Unknown Author"}
        </label>
        {info.publishedDate && (
          <label
            className=" px-2 py-1
        text-xs inline-block text-left"
          >
            {new Date(info.publishedDate).getFullYear()}
          </label>
        )}
      </div>
    </div>
  );
}
