import BookCard from "./BookCard";
export default function BooksGrid({ books, onSelectBook }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onClick={() => onSelectBook(book)}
        />
      ))}
    </div>
  );
}
