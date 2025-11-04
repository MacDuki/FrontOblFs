import { useEffect, useMemo, useState } from "react";
import useCollections from "../../../hooks/useCollections";
import useLibraryItems from "../../../hooks/useLibraryItem";
import { Loader } from "../../ui/Loader";
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        📚 Mis Colecciones
      </h1>

      <form
        onSubmit={handleAdd}
        className="flex gap-3 mb-8 bg-white p-4 rounded-lg shadow-sm border"
      >
        <input
          type="text"
          placeholder="Nueva colección..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
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
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
        >
          🔄 Refrescar
        </button>
      </form>

      {(loading || liLoading) && (
        <div className="flex items-center gap-3 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <Loader size={28} iconSize={0} isBlack />
          <span className="text-blue-700 font-medium">
            Cargando colecciones y libros…
          </span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {String(error)}
        </div>
      )}
      {liError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {String(liError)}
        </div>
      )}

      {isEmpty ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg mb-2">
            📭 No hay colecciones todavía
          </p>
          <p className="text-gray-500 text-sm">
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
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={draftNames[c._id] ?? c.name ?? ""}
                    onChange={(e) => handleNameChange(c._id, e.target.value)}
                    onBlur={(e) =>
                      handleBlur(c._id, e.target.value, c.name || "")
                    }
                    className="flex-1 px-3 py-2 border rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => remove(c._id)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                  >
                    Eliminar
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 pb-2 border-b">
                    <span className="font-medium">
                      📚 {itemsForCollection.length}{" "}
                      {itemsForCollection.length === 1 ? "libro" : "libros"}
                    </span>
                  </div>

                  {itemsForCollection.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <p className="text-sm">No hay libros en esta colección</p>
                      <p className="text-xs mt-1">
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
    </div>
  );
}
