import { User } from "@/types/User";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
};

const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  removeUser: () => set({ user: null }),
}));

export { useAuth };
