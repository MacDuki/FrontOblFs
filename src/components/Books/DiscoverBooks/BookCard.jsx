import { useDispatch } from "react-redux";
import { setSelectedBook } from "../../../features/books.slice";

import OptionsMinimizedBook from "./OptionsMinimizedBook";
export default function BookCard({
  book,
  onClick,
  onOpenCollection,
  onOpenReviews,
}) {
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

  const handleOptionClick = (option) => {
    console.log(
      `Opción ${option.id} clickeada para el libro:`,
      book.volumeInfo.title,
      "id:",
      book.id
    );

    switch (option.id) {
      case "details":
        // Ver detalles del libro
        dispatch(setSelectedBook(book));
        break;
      case "add-to-collection":
        // Abrir modal de colecciones
        onOpenCollection?.(book);
        break;
      case "view-reviews":
        // Abrir modal de reviews del libro
        onOpenReviews?.(book);
        break;
      default:
        break;
    }
  };
  return (
    <div className="group flex flex-col items-start transition-transform duration-200 hover:scale-[1.02]">
      <OptionsMinimizedBook
        key={book.id}
        onOptionClick={handleOptionClick}
        variant="discover"
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
