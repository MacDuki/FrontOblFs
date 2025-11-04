import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SYNC_CONFIG } from "../config/syncConfig";
import {
  clearPetError,
  fetchAllPets,
  fetchSelectedPet,
  recalcSelectedPet,
  selectAllPets,
  selectPetById,
  selectPetError,
  selectPetHappiness,
  selectPetHunger,
  selectPetLoading,
  selectSelectedPet,
  setSelectedPetLocal,
} from "../features/pet.slice";

export default function usePet({
  // eslint-disable-next-line no-unused-vars
  pollMs = SYNC_CONFIG.pet.pollMs,
  // eslint-disable-next-line no-unused-vars
  refetchOnWindowFocus = SYNC_CONFIG.pet.refetchOnWindowFocus,
  // eslint-disable-next-line no-unused-vars
  refetchOnVisibility = SYNC_CONFIG.pet.refetchOnVisibility,
} = {}) {
  const dispatch = useDispatch();

  const pets = useSelector(selectAllPets);
  const selectedPet = useSelector(selectSelectedPet);
  const hunger = useSelector(selectPetHunger);
  const happiness = useSelector(selectPetHappiness);
  const loading = useSelector(selectPetLoading);
  const error = useSelector(selectPetError);

  const loadSelectedPet = useCallback(() => {
    return dispatch(fetchSelectedPet());
  }, [dispatch]);

  const loadAllPets = useCallback(() => {
    return dispatch(fetchAllPets());
  }, [dispatch]);

  const recalc = useCallback(() => {
    return dispatch(recalcSelectedPet());
  }, [dispatch]);

  const selectPet = useCallback(
    async (petId) => {
      if (!petId) return;
      // Selección optimista local para cambiar la imagen al instante y evitar loaders
      dispatch(setSelectedPetLocal(petId));
      // Ejecuta las operaciones reales en background para no activar loaders globales
      await dispatch(selectPetById({ petId, background: true }));
      return dispatch(fetchSelectedPet({ background: true }));
    },
    [dispatch]
  );

  const refreshAll = useCallback(async () => {
    // carga listado y la seleccionada; evita dependencias de orden
    await dispatch(fetchAllPets());
    await dispatch(fetchSelectedPet());
  }, [dispatch]);

  const clearErrorNow = useCallback(() => {
    dispatch(clearPetError());
  }, [dispatch]);

  const state = useMemo(
    () => ({ pets, selectedPet, hunger, happiness, loading, error }),
    [pets, selectedPet, hunger, happiness, loading, error]
  );

  const actions = useMemo(
    () => ({
      loadSelectedPet,
      loadAllPets,
      recalc,
      selectPet,
      refreshAll,
      clearError: clearErrorNow,
    }),
    [loadSelectedPet, loadAllPets, recalc, selectPet, refreshAll, clearErrorNow]
  );

  return { ...state, ...actions };
}
