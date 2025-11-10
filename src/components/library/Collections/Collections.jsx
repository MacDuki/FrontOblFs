import { useEffect, useMemo, useState } from "react";
import useCollections from "../../../hooks/useCollections";
import useLibraryItems from "../../../hooks/useLibraryItem";
import { Loader } from "../../ui/Loader";
import AddPagesModal from "../AddPagesModal";
import LibraryItemCard from "../LibraryItemCard";
export default function CollectionsView() {
  const {
    collections,
    loading,
    error,
    add,
    remove,
    debouncedRename,
    rename,
    refetch,
  } = useCollections({ pollMs: 0 });

  const {
    items: libraryItems,
    loading: liLoading,
    error: liError,
    refetchUser: refetchLibrary,
    remove: removeLibraryItem,
  } = useLibraryItems({
    pollMs: 0,
    refetchOnWindowFocus: false,
    refetchOnVisibility: false,
  });

  const [newName, setNewName] = useState("");
  const [draftNames, setDraftNames] = useState({});
  const isEmpty = useMemo(
    () => !collections || collections.length === 0,
    [collections]
  );

  useEffect(() => {
    // reset borradores al refrescar lista
    setDraftNames({});
    // ❌ ELIMINADO: revalidación automática por colección
    // Ahora los items se cargan una sola vez al inicio desde fetchLibraryItemsByUser
    // que ya incluye todos los items con su collectionId
  }, [collections]);

  const handleAdd = async (e) => {
    e?.preventDefault?.();
    const name = newName.trim();
    if (!name) return;
    try {
      await add(name);
      setNewName("");
    } catch (e) {
      console.error(e);
      alert(typeof e === "string" ? e : e?.message || "No se pudo crear");
    }
  };

  const handleNameChange = (id, value) => {
    setDraftNames((prev) => ({ ...prev, [id]: value }));
    debouncedRename({ id, name: value });
  };

  const handleBlur = async (id, value, current) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === current) return;
    try {
      await rename({ id, name: trimmed });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este libro?")) return;
    try {
      await removeLibraryItem(itemId);
    } catch (e) {
      console.error(e);
      alert(typeof e === "string" ? e : e?.message || "No se pudo eliminar");
    }
  };

  const handleViewDetails = (item) => {
    console.log("Ver detalles de:", item);
    // Aquí puedes abrir un modal o navegar a una página de detalles
  };

  // Modal para agregar páginas (lifted state)
  const [showAddPages, setShowAddPages] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { addPages } = useLibraryItems({
    pollMs: 0,
    refetchOnWindowFocus: false,
    refetchOnVisibility: false,
  });

  const openAddPagesFor = (item) => {
    setSelectedItem(item);
    setShowAddPages(true);
  };

  const handleConfirmAddPages = async (pages) => {
    if (!selectedItem?._id) return;
    await addPages({ id: selectedItem._id, pages });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">📚 Mis Colecciones</h1>

      <form
        onSubmit={handleAdd}
        className="flex gap-3 mb-8 bg-white/5 backdrop-blur-xl p-4 rounded-lg border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,.3)]"
      >
        <input
          type="text"
          placeholder="Nueva colección..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 border border-white/10 bg-white/5 text-white placeholder-white/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors font-semibold disabled:bg-white/10 disabled:cursor-not-allowed disabled:text-white/40"
          disabled={!newName.trim()}
        >
          ➕ Añadir
        </button>
        <button
          type="button"
          onClick={() => {
            refetch();
            refetchLibrary();
          }}
          className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors font-medium"
        >
          🔄 Refrescar
        </button>
      </form>

      {(loading || liLoading) && (
        <div className="flex items-center gap-3 mb-6 bg-white/5 backdrop-blur-xl p-4 rounded-lg border border-white/10">
          <Loader size={28} iconSize={0} />
          <span className="text-white/80 font-medium">
            Cargando colecciones y libros…
          </span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300">
          {String(error)}
        </div>
      )}
      {liError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300">
          {String(liError)}
        </div>
      )}

      {isEmpty ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-lg border-2 border-dashed border-white/10">
          <p className="text-white/70 text-lg mb-2">
            📭 No hay colecciones todavía
          </p>
          <p className="text-white/50 text-sm">
            Crea tu primera colección arriba para organizar tus libros
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {collections.map((c) => {
            const itemsForCollection = (libraryItems || []).filter(
              (it) => it?.collectionId === c._id
            );
            return (
              <li
                key={c._id}
                className="border border-white/10 rounded-lg p-4 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,.3)]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={draftNames[c._id] ?? c.name ?? ""}
                    onChange={(e) => handleNameChange(c._id, e.target.value)}
                    onBlur={(e) =>
                      handleBlur(c._id, e.target.value, c.name || "")
                    }
                    className="flex-1 px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <button
                    onClick={() => remove(c._id)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors font-semibold"
                  >
                    Eliminar
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-white/70 pb-2 border-b border-white/10">
                    <span className="font-medium">
                      📚 {itemsForCollection.length}{" "}
                      {itemsForCollection.length === 1 ? "libro" : "libros"}
                    </span>
                  </div>

                  {itemsForCollection.length === 0 ? (
                    <div className="text-center py-8 text-white/60 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-sm">No hay libros en esta colección</p>
                      <p className="text-xs mt-1 text-white/50">
                        Agrega libros desde la sección de descubrir
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {itemsForCollection.map((item) => (
                        <LibraryItemCard
                          key={item._id}
                          item={item}
                          onRemove={handleRemoveItem}
                          onViewDetails={handleViewDetails}
                          onRequestAddPages={openAddPagesFor}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {/* Modal global para agregar páginas */}
      <AddPagesModal
        open={showAddPages}
        progreso={selectedItem?.progreso || 0}
        pageCount={selectedItem?.pageCount || 0}
        onClose={() => {
          setShowAddPages(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmAddPages}
      />
    </div>
  );
}
