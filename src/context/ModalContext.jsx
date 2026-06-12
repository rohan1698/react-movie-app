/* Single app-level content modal. Any card or hero "Watch Now" calls
   openModal({ id, media_type }); one ContentModal instance at the app root
   reads the target and fetches details lazily — so detail/video requests only
   fire when the user actually opens something (not once per card on mount). */
import { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [target, setTarget] = useState(null); // { id, media_type } | null

  const openModal = useCallback((next) => {
    if (!next || !next.id || !next.media_type) return;
    setTarget(next);
  }, []);

  const closeModal = useCallback(() => setTarget(null), []);

  return (
    <ModalContext.Provider value={{ target, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
