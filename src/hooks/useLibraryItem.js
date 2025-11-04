// src/hooks/useLibraryItems.js
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shouldMakeCall, SYNC_CONFIG } from "../config/syncConfig";
import {
  addLibraryItem,
  addOptimistic,
  addPagesOptimistic,
  addPagesToLibraryItem,
  changeEstadoLibraryItem,
  changeEstadoOptimistic,
  deleteLibraryItem,
  ESTADOS_LIBRO,
  fetchLibraryItemById,
  fetchLibraryItemsByCollection,
  fetchLibraryItemsByUser,
  markSynced,
  removeOptimistic,
  revertEstado,
  revertPages,
  selectAllLibraryItems,
  selectLibraryError,
  selectLibraryLoading,
} from "../features/libraryItem.slice";

export default function useLibraryItems({
  pollMs = SYNC_CONFIG.libraryItems.pollMs,
  refetchOnWindowFocus = SYNC_CONFIG.libraryItems.refetchOnWindowFocus,
  refetchOnVisibility = SYNC_CONFIG.libraryItems.refetchOnVisibility,
} = {}) {
  const dispatch = useDispatch();
  const items = useSelector(selectAllLibraryItems);
  const loading = useSelector(selectLibraryLoading);
  const error = useSelector(selectLibraryError);

  // ---- Sync inicial ----
  useEffect(() => {
    if (SYNC_CONFIG.libraryItems.syncOnMount) {
      if (shouldMakeCall("libraryItems-initial")) {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("🔄 [LibraryItems] Sync inicial");
        }
        dispatch(fetchLibraryItemsByUser());
      }
    }
  }, [dispatch]);

  // ---- Revalidación por foco/visibilidad ----
  useEffect(() => {
    if (!refetchOnWindowFocus && !refetchOnVisibility) return;

    const onFocus = () => {
      if (shouldMakeCall("libraryItems-focus")) {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("🔄 [LibraryItems] Refetch por foco");
        }
        dispatch(fetchLibraryItemsByUser());
      }
    };

    const onVisibility = () => {
      if (
        document.visibilityState === "visible" &&
        shouldMakeCall("libraryItems-visibility")
      ) {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("🔄 [LibraryItems] Refetch por visibilidad");
        }
        dispatch(fetchLibraryItemsByUser());
      }
    };

    if (refetchOnWindowFocus) window.addEventListener("focus", onFocus);
    if (refetchOnVisibility)
      document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (refetchOnWindowFocus) window.removeEventListener("focus", onFocus);
      if (refetchOnVisibility)
        document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [dispatch, refetchOnWindowFocus, refetchOnVisibility]);

  // ---- Polling ligero ----
  useEffect(() => {
    if (!pollMs || pollMs <= 0) {
      if (SYNC_CONFIG.global.enableSyncLogs) {
        console.log("⏸️ [LibraryItems] Polling deshabilitado");
      }
      return;
    }

    if (SYNC_CONFIG.global.enableSyncLogs) {
      console.log(`🔄 [LibraryItems] Polling habilitado cada ${pollMs}ms`);
    }

    const t = setInterval(() => {
      if (shouldMakeCall("libraryItems-poll")) {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("🔄 [LibraryItems] Refetch por polling");
        }
        dispatch(fetchLibraryItemsByUser()).finally(() =>
          dispatch(markSynced())
        );
      }
    }, pollMs);

    return () => clearInterval(t);
  }, [dispatch, pollMs]);

  // ---- CRUD con optimismo ----
  const add = useCallback(
    async (payload) => {
      const tempId = `temp-${Date.now()}`;
      const temp = {
        _id: tempId,
        __tempKey: `k-${Date.now()}`,
        progreso: 0,
        estado: ESTADOS_LIBRO.NONE,
        ...payload,
      };
      dispatch(addOptimistic(temp));
      try {
        await dispatch(
          addLibraryItem({ ...payload, __tempKey: temp.__tempKey })
        ).unwrap();
      } catch (e) {
        dispatch(removeOptimistic(tempId));
        throw e;
      }
    },
    [dispatch]
  );

  const remove = useCallback(
    async (id) => {
      const backup = items.find((x) => x._id === id);
      // quitar local
      dispatch({ type: "libraryItems/delete/fulfilled", payload: { id } });
      try {
        await dispatch(deleteLibraryItem(id)).unwrap();
      } catch (e) {
        if (backup)
          dispatch({ type: "libraryItems/add/fulfilled", payload: backup });
        throw e;
      }
    },
    [dispatch, items]
  );

  const addPages = useCallback(
    async ({ id, pages }) => {
      dispatch(addPagesOptimistic({ id, pages }));
      try {
        await dispatch(addPagesToLibraryItem({ id, pages })).unwrap();
      } catch (e) {
        dispatch(revertPages({ id }));
        throw e;
      }
    },
    [dispatch]
  );

  const changeEstado = useCallback(
    async ({ id, estado }) => {
      dispatch(changeEstadoOptimistic({ id, estado }));
      try {
        await dispatch(changeEstadoLibraryItem({ id, estado })).unwrap();
      } catch (e) {
        dispatch(revertEstado({ id }));
        throw e;
      }
    },
    [dispatch]
  );

  const refetchUser = useCallback(
    () => dispatch(fetchLibraryItemsByUser()),
    [dispatch]
  );
  const refetchCollection = useCallback(
    (collectionId) => dispatch(fetchLibraryItemsByCollection(collectionId)),
    [dispatch]
  );
  const fetchById = useCallback(
    (id) => dispatch(fetchLibraryItemById(id)),
    [dispatch]
  );

  const byId = useMemo(() => {
    const map = new Map();
    for (const it of items) map.set(it._id, it);
    return map;
  }, [items]);

  return {
    items,
    loading,
    error,
    byId,
    add,
    remove,
    addPages,
    changeEstado,
    refetchUser,
    refetchCollection,
    fetchById,
    ESTADOS_LIBRO,
  };
}
