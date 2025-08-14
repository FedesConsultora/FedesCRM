import { createContext, useState, useCallback, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import SelectOrgModal from '../components/SelectOrgModal';
// Opcional: si tenés un componente dedicado para reenvío
// import ResendConfirmationModal from '../components/ResendConfirmationModal';

export const ModalCtx = createContext({});

export default function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  /**
   * API:
   * showModal({
   *   type: 'info' | 'confirm' | 'google' | 'resend' | 'select-org',
   *   title, message, email?,
   *   options?: Array<{ orgId, nombre, rol }>,            // select-org
   *   onSelect?: (orgId) => void,                          // select-org
   *   onConfirm?: () => void | (payload?) => void,         // confirm/google/select-org
   *   onCancel?: () => void,
   *   confirmText?: string,
   *   cancelText?: string,
   *   dismissible?: boolean, // default true (backdrop/ESC cierran)
   * })
   */
  const showModal = useCallback((cfg) => {
    const {
      type = 'info',
      title = '',
      message = '',
      email = null,
      options = [],
      onSelect = null,
      onConfirm = null,
      onCancel = null,
      confirmText,
      cancelText,
      dismissible = true
    } = cfg || {};
    setModal({
      open: true,
      type,
      title,
      message,
      email,
      options,
      onSelect,
      onConfirm,
      onCancel,
      confirmText,
      cancelText,
      dismissible
    });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  // Cerrar con ESC si es dismissible
  useEffect(() => {
    if (!modal?.open || modal?.dismissible === false) return;
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, closeModal]);

  const onBackdropClick = () => {
    if (modal?.dismissible !== false) closeModal();
  };

  // Helpers UI
  const ConfirmActions = () => (
    <div className="modal-actions" style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <button
        type="button"
        className="btn-primary"
        onClick={() => { modal?.onConfirm?.(); closeModal(); }}
      >
        {modal?.confirmText || 'Sí'}
      </button>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => { modal?.onCancel?.(); closeModal(); }}
      >
        {modal?.cancelText || 'No'}
      </button>
    </div>
  );

  const InfoActions = () => (
    <div className="modal-actions" style={{ marginTop: '1rem' }}>
      <button type="button" onClick={closeModal} className="link-btn">Cerrar</button>
    </div>
  );

  const GoogleActions = () => (
    <div className="modal-actions" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
      <button
        type="button"
        className="google-btn"
        onClick={() => {
          // OPCIÓN A (redirect): pasá onConfirm que haga window.location.href = googleAuthUrl()
          // OPCIÓN B (One Tap / useGoogleLogin): pasá onConfirm que obtenga idToken y luego llame a tu api googleLogin({ idToken })
          if (typeof modal?.onConfirm === 'function') {
            modal.onConfirm();
          }
        }}
      >
        <FcGoogle size={20} /> Iniciar con Google
      </button>
      <button type="button" onClick={closeModal} className="link-btn" style={{ marginLeft: 12 }}>
        Cancelar
      </button>
    </div>
  );

  return (
    <ModalCtx.Provider value={{ showModal, closeModal }}>
      {children}

      {modal?.open && (
        <div className="modal-backdrop" onClick={onBackdropClick}>
          <div
            className="auth-card modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {modal.title && (
              <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{modal.title}</h3>
            )}
            {modal.message && (
              <p style={{ textAlign: 'center', fontSize: '0.95rem' }}>{modal.message}</p>
            )}

            {/* --- Tipos --- */}
            {modal.type === 'confirm'     && <ConfirmActions />}
            {modal.type === 'google'      && <GoogleActions />}
            {modal.type === 'resend'      && (
              // Si tenés un componente propio, reemplazá este bloque.
              <div className="modal-actions" style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Te enviamos un email para verificar tu cuenta{modal?.email ? `: ${modal.email}` : ''}.
                </p>
                <button type="button" onClick={closeModal} className="btn-primary" style={{ marginTop: 12 }}>
                  Entendido
                </button>
              </div>
            )}
            {modal.type === 'select-org' && (
              <SelectOrgModal
                title={modal.title}
                message={modal.message}
                options={modal.options}
                onSelect={modal.onSelect}
                onConfirm={modal.onConfirm}
                onCancel={modal.onCancel}
                closeModal={closeModal}
                confirmText={modal.confirmText}
                cancelText={modal.cancelText}
              />
            )}
            {modal.type === 'info'        && <InfoActions />}
          </div>
        </div>
      )}
    </ModalCtx.Provider>
  );
}
