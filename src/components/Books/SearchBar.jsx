export default function SearchBar({ search, setSearch }) {
  return (
    <div className="search-wrapper">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for a book or an author..."
        className="search-input"
      />
    </div>
  );
}
