import BookCard from "./BookCard";
//hehe
export default function BooksGrid({ books }) {
  return (
    <div className="books-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
