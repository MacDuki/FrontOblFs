import { CgDetailsMore } from "react-icons/cg";
import { CiFolderOn, CiHeart, CiShare2 } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { setSelectedBook } from "../../../features/books.slice";

import OptionsMinimizedBook from "./OptionsMinimizedBook";
export default function BookCard({ book, onClick }) {
  const dispatch = useDispatch();
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
      icon: <CiHeart size={22} />,
      label: "Add to favorites",
      position: "top",
    },
    {
      id: "add-to-section",
      icon: <CiFolderOn size={22} />,
      label: "Add to section",
      position: "right",
    },
    {
      id: "share",
      icon: <CiShare2 size={22} />,
      label: "Share",
      position: "bottom",
    },
    {
      id: "info",
      icon: <CgDetailsMore size={22} />,
      label: "View details",
      position: "left",
    },
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
        dispatch(setSelectedBook(book));
        break;
      default:
        break;
    }
  };
  return (
    <div className="group flex flex-col items-start transition-transform duration-200 hover:scale-[1.02]">
      <OptionsMinimizedBook
        key={book.id}
        options={bookOptions}
        onOptionClick={(option) => handleOptionClick(option, book)}
      >
        <div
          className="relative h-52 w-34 cursor-pointer overflow-hidden rounded-2xl border border-stone-200/70 shadow-md bg-stone-100/40"
          onClick={onClick}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.03]"
            style={{ backgroundImage: `url(${getCoverImage(info)})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/10" />
        </div>
      </OptionsMinimizedBook>
      <div className="space-y-1.5 flex flex-col items-start mt-2">
        <p className="px-1 m-0 text-[15px] font-semibold tracking-tight text-white-900 truncate w-[166px]">
          {info.title}
        </p>

        <p className="px-1 m-0 text-xs text-stone-600">
          {info.authors?.join(", ") || "Unknown Author"}
        </p>
        {info.publishedDate && (
          <p className="px-1 text-[11px] text-stone-500">
            {new Date(info.publishedDate).getFullYear()}
          </p>
        )}
      </div>
    </div>
  );
}
