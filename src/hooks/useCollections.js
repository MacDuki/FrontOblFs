// src/hooks/useCollections.js
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SYNC_CONFIG, shouldMakeCall } from "../config/syncConfig";
import {
  createCollection,
  createOptimistic,
  deleteCollection,
  fetchCollections,
  markSynced,
  removeOptimistic,
  renameCollection,
  renameOptimistic,
  revertRename,
  selectAllCollections,
  selectCollectionsError,
  selectCollectionsLoading,
} from "../features/collections.slice";

// Utilidad: debounce simple
function useDebouncedCallback(fn, ms) {
  const t = useRef(null);
  return useCallback(
    (...args) => {
      if (t.current) clearTimeout(t.current);
      t.current = setTimeout(() => fn(...args), ms);
    },
    [fn, ms]
  );
}

export default function useCollections({
  // control fino del "tiempo real"
  pollMs = SYNC_CONFIG.collections.pollMs,
  refetchOnWindowFocus = SYNC_CONFIG.collections.refetchOnWindowFocus,
  refetchOnVisibility = SYNC_CONFIG.collections.refetchOnVisibility,
} = {}) {
  const dispatch = useDispatch();
  const collections = useSelector(selectAllCollections);
  const loading = useSelector(selectCollectionsLoading);
  const error = useSelector(selectCollectionsError);

  // --------- CRUD con UI optimista ---------
  const add = useCallback(
    async (name) => {
      // placeholder local
      const temp = {
        _id: `temp-${Date.now()}`,
        name,
        user: "me",
        __v: 0,
        __tempKey: `k-${Date.now()}`,
      };
      dispatch(createOptimistic(temp));
      try {
        await dispatch(
          createCollection({ name, __tempKey: temp.__tempKey })
        ).unwrap();
      } catch (e) {
        dispatch(removeOptimistic(temp._id));
        throw e;
      }
    },
    [dispatch]
  );

  const rename = useCallback(
    async ({ id, name }) => {
      const current = collections.find((c) => c._id === id)?.name ?? undefined;
      dispatch(renameOptimistic({ id, name, prevName: current }));
      try {
        await dispatch(renameCollection({ id, name })).unwrap();
      } catch (e) {
        dispatch(revertRename({ id }));
        throw e;
      }
    },
    [dispatch, collections]
  );

  const remove = useCallback(
    async (id) => {
      // optimista: eliminar local y reinsertar si falla
      const backup = collections.find((c) => c._id === id);
      dispatch(deleteCollection.pending("", { arg: { id } }));
      // quitar local
      dispatch({
        type: "collections/delete/fulfilled",
        payload: { id },
      });
      try {
        await dispatch(deleteCollection({ id })).unwrap();
      } catch (e) {
        // revertir
        if (backup) {
          dispatch({
            type: "collections/create/fulfilled",
            payload: backup,
          });
        }
        throw e;
      }
    },
    [dispatch, collections]
  );

  // --------- Sync inicial ---------
  useEffect(() => {
    if (SYNC_CONFIG.collections.syncOnMount) {
      if (shouldMakeCall("collections-initial")) {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("🔄 [Collections] Sync inicial");
        }
        dispatch(fetchCollections());
      }
    }
  }, [dispatch]);

  // --------- Revalidación por foco/visibilidad ---------
  useEffect(() => {
    if (!refetchOnWindowFocus && !refetchOnVisibility) return;

    const onFocus = () => {
      if (shouldMakeCall("collections-focus")) {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("🔄 [Collections] Refetch por foco");
        }
        dispatch(fetchCollections());
      }
    };

    const onVisibility = () => {
      if (
        document.visibilityState === "visible" &&
        shouldMakeCall("collections-visibility")
      ) {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("🔄 [Collections] Refetch por visibilidad");
        }
        dispatch(fetchCollections());
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

  // --------- Pull periódico ligero ---------
  useEffect(() => {
    if (!pollMs || pollMs <= 0) {
      if (SYNC_CONFIG.global.enableSyncLogs) {
        console.log("⏸️ [Collections] Polling deshabilitado");
      }
      return;
    }

    if (SYNC_CONFIG.global.enableSyncLogs) {
      console.log(`🔄 [Collections] Polling habilitado cada ${pollMs}ms`);
    }

    let timer = setInterval(() => {
      if (shouldMakeCall("collections-poll")) {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("🔄 [Collections] Refetch por polling");
        }
        dispatch(fetchCollections()).finally(() => dispatch(markSynced()));
      }
    }, pollMs);

    return () => clearInterval(timer);
  }, [dispatch, pollMs]);

  // --------- Búsquedas memorizadas y helpers ---------
  const byId = useMemo(() => {
    const map = new Map();
    for (const c of collections) map.set(c._id, c);
    return map;
  }, [collections]);

  const debouncedRename = useDebouncedCallback(rename, 400);

  return {
    collections,
    loading,
    error,
    byId,
    add,
    rename,
    debouncedRename,
    remove,
    refetch: () => dispatch(fetchCollections()),
  };
}
