import { createContext, useState, useCallback } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { googleLogin } from '../../api/core'; 

export const ModalCtx = createContext({});

export default function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const showModal = useCallback(({ title, message, email, type = 'info', onConfirm, onCancel }) => {
    setModal({ title, message, email, type, onConfirm, onCancel });
  }, []);

  const closeModal = () => setModal(null);

  return (
    <ModalCtx.Provider value={{ showModal, closeModal }}>
      {children}

      {modal && (
        <div className="modal-backdrop">
          <div className="auth-card modal-card">
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{modal.title}</h3>
            <p style={{ textAlign: 'center', fontSize: '0.95rem' }}>{modal.message}</p>

            {/* Confirmación genérica */}
            {modal.type === 'confirm' && (
              <div className="modal-actions" style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    modal.onConfirm?.();
                    closeModal();
                  }}
                >
                  Sí
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    modal.onCancel?.();
                    closeModal();
                  }}
                >
                  No
                </button>
              </div>
            )}

            {/* Login con Google */}
            {modal.type === 'google' && (
              <div className="modal-actions" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className="google-btn"
                  onClick={() => googleLogin()}
                >
                  <FcGoogle size={20} /> Iniciar con Google
                </button>
              </div>
            )}

            {/* Modal informativo simple */}
            {modal.type === 'info' && (
              <div className="modal-actions" style={{ marginTop: '1rem' }}>
                <button type="button" onClick={closeModal} className="link-btn">
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </ModalCtx.Provider>
  );
}
