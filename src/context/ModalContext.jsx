import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const openModal = (component) => setModal(component);
  const closeModal = () => setModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {modal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-40 px-4 py-6 sm:py-10 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-6xl min-w-[350px] flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {modal}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
