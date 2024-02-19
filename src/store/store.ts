import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//Modal Hooks

type LoginModalProps = {
  isLoginOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
};

export const useLoginModal = create<LoginModalProps>()((set) => ({
  isLoginOpen: false,
  openLoginModal: () => set(() => ({ isLoginOpen: true })),
  closeLoginModal: () => set(() => ({ isLoginOpen: false })),
}));

type RegisterModalProps = {
  isRegisterOpen: boolean;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
};

export const useRegisterModal = create<RegisterModalProps>()((set) => ({
  isRegisterOpen: false,
  openRegisterModal: () => set(() => ({ isRegisterOpen: true })),
  closeRegisterModal: () => set(() => ({ isRegisterOpen: false })),
}));

//Authentication Hooks

interface UseUserProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
  userRegistration: (
    id: string,
    name: string,
    email: string,
    image: string | null
  ) => void;
  userLogin: (
    id: string,
    name: string,
    email: string,
    image: string | null
  ) => void;
  userLogout: () => void;
  updateUser: (
    id: string,
    name: string,
    email: string,
    image: string | null
  ) => void;
}

export const useUser = create<UseUserProps>()(
  persist(
    (set) => ({
      user: null,
      userRegistration(
        id: string,
        name: string,
        email: string,
        image: string | null
      ) {
        set({ user: { id, name, email, image } });
      },
      userLogin(id: string, name: string, email: string, image: string | null) {
        set({ user: { id, name, email, image } });
      },
      userLogout() {
        set({ user: undefined });
      },
      updateUser(
        id: string,
        name: string,
        email: string,
        image: string | null
      ) {
        set({ user: { id, name, email, image } });
      },
    }),
    {
      name: "register-bucket",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
