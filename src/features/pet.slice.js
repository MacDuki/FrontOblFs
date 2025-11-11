import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";
import { logout } from "./auth.slice";

// ---------- Utils ----------
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const k of aKeys) {
    if (a[k] !== b[k]) return false;
  }
  return true;
};

const shallowAssignDiff = (target, source) => {
  if (!target || !source) return true;
  let changed = false;
  for (const k of Object.keys(source)) {
    if (target[k] !== source[k]) {
      target[k] = source[k];
      changed = true;
    }
  }
  return changed;
};

// ---------- Thunks ----------
export const fetchSelectedPet = createAsyncThunk(
  "pets/fetchSelectedPet",
  async (opts, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/pets/selected");
      console.log("🐾 [Pet API] fetchSelectedPet response:", data);
      // data: { pet, hunger, happiness, lastUpdate }
      return {
        pet: data.pet,
        hunger: data.hunger,
        happiness: data.happiness,
        lastUpdate: data.lastUpdate,
        background: opts?.background || false,
      };
    } catch (err) {
      console.error("❌ [Pet API] fetchSelectedPet error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Error al traer la mascota seleccionada"
      );
    }
  }
);

export const recalcSelectedPet = createAsyncThunk(
  "pets/recalcSelectedPet",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/pets/selected/recalc");
      console.log("🐾 [Pet API] recalcSelectedPet response:", data);
      // data: { hunger, happiness, petId }
      return {
        petId: data.petId,
        hunger: data.hunger,
        happiness: data.happiness,
        lastUpdate: new Date().toISOString(),
      };
    } catch (err) {
      console.error("❌ [Pet API] recalcSelectedPet error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Error al recalcular felicidad/hambre"
      );
    }
  }
);

export const selectPetById = createAsyncThunk(
  "pets/selectPetById",
  async (arg, { rejectWithValue }) => {
    try {
      const petId = typeof arg === "string" ? arg : arg?.petId;
      const { data } = await api.post(`/pets/select/${petId}`);
      console.log(`🐾 [Pet API] selectPetById (${petId}) response:`, data);
      // La API devuelve el objeto mascota directamente (no envuelve en { pet })
      return data;
    } catch (err) {
      const petId = typeof arg === "string" ? arg : arg?.petId;
      console.error(`❌ [Pet API] selectPetById (${petId}) error:`, err);
      return rejectWithValue(
        err.response?.data?.message || "Error al seleccionar mascota"
      );
    }
  }
);

export const fetchAllPets = createAsyncThunk(
  "pets/fetchAllPets",
  async (opts, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/pets");
      console.log("🐾 [Pet API] fetchAllPets response:", data);
      // data: array de mascotas
      return {
        list: data.map((pet) => pet),
        background: opts?.background || false,
      };
    } catch (err) {
      console.error("❌ [Pet API] fetchAllPets error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Error al traer mascotas"
      );
    }
  }
);

// ---------- Estado ----------
const initialState = {
  pets: [],
  selectedPet: null,
  hunger: null,
  happiness: null,
  lastUpdate: null,
  loading: false,
  error: null,
};

// ---------- Slice ----------
const petSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    clearPetError(state) {
      state.error = null;
    },
    // Selección optimista local para cambiar la UI al instante sin loaders
    setSelectedPetLocal(state, action) {
      const selId = action.payload;
      if (!selId) return;
      // intenta encontrar la mascota en el listado
      const found = state.pets.find((p) => p._id === selId);
      if (!state.selectedPet) state.selectedPet = found || { _id: selId };
      else if (found) {
        // si existe, copia campos manteniendo la ref
        shallowAssignDiff(state.selectedPet, found);
      } else {
        // si no existe, al menos fija el id
        state.selectedPet._id = selId;
      }
      // marca selección en el listado
      for (let i = 0; i < state.pets.length; i++) {
        const p = state.pets[i];
        const desired = p._id === selId;
        if (p.isSelected !== desired) p.isSelected = desired;
      }
      // no toques loading ni métricas aquí
    },
  },
  extraReducers: (builder) => {
    // fetchSelectedPet
    builder
      .addCase(fetchSelectedPet.pending, (state, action) => {
        const background = action.meta?.arg?.background;
        if (!background) state.loading = true;
        state.error = null;
      })
      .addCase(fetchSelectedPet.fulfilled, (state, action) => {
        const background = action.payload.background;
        if (!background) state.loading = false;
        // Actualiza sólo lo diferente
        const incomingPet = action.payload.pet;
        if (incomingPet) {
          if (!state.selectedPet) {
            state.selectedPet = incomingPet;
          } else if (!shallowEqual(state.selectedPet, incomingPet)) {
            shallowAssignDiff(state.selectedPet, incomingPet);
          }
        }
        if (state.hunger !== action.payload.hunger)
          state.hunger = action.payload.hunger;
        if (state.happiness !== action.payload.happiness)
          state.happiness = action.payload.happiness;
        if (state.lastUpdate !== action.payload.lastUpdate)
          state.lastUpdate = action.payload.lastUpdate;
        // marca isSelected en pets si coincide, preservando referencias
        if (state.pets.length && incomingPet?._id) {
          for (let i = 0; i < state.pets.length; i++) {
            const p = state.pets[i];
            const desired = p._id === incomingPet._id;
            if (p.isSelected !== desired) {
              p.isSelected = desired;
            }
          }
        }
      })
      .addCase(fetchSelectedPet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      });

    // recalcSelectedPet
    builder
      .addCase(recalcSelectedPet.pending, (state) => {
        state.error = null;
      })
      .addCase(recalcSelectedPet.fulfilled, (state, action) => {
        if (state.hunger !== action.payload.hunger)
          state.hunger = action.payload.hunger;
        if (state.happiness !== action.payload.happiness)
          state.happiness = action.payload.happiness;
        if (state.lastUpdate !== action.payload.lastUpdate)
          state.lastUpdate = action.payload.lastUpdate;
        // nada más que tocar aquí
      })
      .addCase(recalcSelectedPet.rejected, (state, action) => {
        state.error = action.payload || "Error";
      });

    // selectPetById
    builder
      .addCase(selectPetById.pending, (state, action) => {
        const background = action.meta?.arg?.background;
        if (!background) state.loading = true;
        state.error = null;
      })
      .addCase(selectPetById.fulfilled, (state, action) => {
        state.loading = false;
        const incoming = action.payload;
        if (!state.selectedPet) state.selectedPet = incoming;
        else shallowAssignDiff(state.selectedPet, incoming);
        // refleja selección en listado preservando referencias
        const selId = incoming?._id;
        for (let i = 0; i < state.pets.length; i++) {
          const p = state.pets[i];
          const desired = p._id === selId;
          if (p.isSelected !== desired) p.isSelected = desired;
        }
        // resetea métricas si tu dominio lo requiere; si no, déjalo como está
      })
      .addCase(selectPetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      });

    // fetchAllPets
    builder
      .addCase(fetchAllPets.pending, (state, action) => {
        const background = action.meta?.arg?.background;
        if (!background) state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPets.fulfilled, (state, action) => {
        const background = action.payload.background;
        if (!background) state.loading = false;
        const incoming = action.payload.list || [];
        // reconstruye preservando referencias cuando no cambian
        const byId = new Map(state.pets.map((p) => [p._id, p]));
        const next = [];
        for (const inc of incoming) {
          const existing = byId.get(inc._id);
          if (existing) {
            if (!shallowEqual(existing, inc)) {
              // muta el existente con los cambios
              shallowAssignDiff(existing, inc);
            }
            next.push(existing);
          } else {
            next.push(inc);
          }
        }
        state.pets = next;
        // si alguna viene con isSelected, fija selectedPet (sin reemplazar ref si ya existe)
        const selected = state.pets.find((p) => p.isSelected);
        if (selected) {
          if (!state.selectedPet) state.selectedPet = selected;
          else if (state.selectedPet._id === selected._id) {
            // ya es la seleccionada; opcionalmente alinear campos
            shallowAssignDiff(state.selectedPet, selected);
          }
        }
      })
      .addCase(fetchAllPets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })
      // Escuchar el logout de auth para limpiar el estado
      .addCase(logout, (state) => {
        state.pets = [];
        state.selectedPet = null;
        state.hunger = null;
        state.happiness = null;
        state.lastUpdate = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearPetError, setSelectedPetLocal } = petSlice.actions;

// ---------- Selectores mínimos ----------
export const selectPetState = (s) => s.pets;
export const selectAllPets = (s) => s.pets.pets;
export const selectSelectedPet = (s) => s.pets.selectedPet;
export const selectPetHunger = (s) => s.pets.hunger;
export const selectPetHappiness = (s) => s.pets.happiness;
export const selectPetLoading = (s) => s.pets.loading;
export const selectPetError = (s) => s.pets.error;

export default petSlice.reducer;
