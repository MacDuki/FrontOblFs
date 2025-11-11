import { useDispatch } from "react-redux";
import { setSelectedBook } from "../../../features/books.slice";
import BookCard from "./BookCard";

export default function BooksGrid({ books, onOpenCollection, onOpenReviews }) {
  const dispatch = useDispatch();

  const handleSelectBook = (book) => {
    dispatch(setSelectedBook(book));
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5 md:gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onClick={() => handleSelectBook(book)}
          onOpenCollection={onOpenCollection}
          onOpenReviews={onOpenReviews}
        />
      ))}
    </div>
  );
}
