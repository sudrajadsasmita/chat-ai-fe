import { INITIAL_STATE_USER } from "@/constants/auth-constant";
import { User } from "@/types/auth";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
