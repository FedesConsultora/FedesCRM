import React, { useState } from 'react';

/**
 * Componente de selección de organización.
 * Props:
 *  - title, message
 *  - options: [{ orgId, nombre, rol }]
 *  - onSelect(orgId) | onConfirm(orgId) | onCancel()
 *  - closeModal()  → siempre disponible desde el provider
 *  - confirmText, cancelText
 */
export default function SelectOrgModal({
  title = 'Seleccioná una organización',
  message = 'Elegí una organización para continuar.',
  options = [],
  onSelect,
  onConfirm,
  onCancel,
  closeModal,
  confirmText = 'Continuar',
  cancelText = 'Cancelar',
}) {
  const [selected, setSelected] = useState(options?.[0]?.orgId ?? null);

  const handleChoose = (orgId) => {
    // Acción inmediata (click en tarjeta) o solo selección
    setSelected(orgId);
  };

  const handleConfirm = () => {
    if (!selected) return;
    if (typeof onSelect === 'function') onSelect(selected);
    else if (typeof onConfirm === 'function') onConfirm(selected);
    closeModal?.();
  };

  const handleCancel = () => {
    onCancel?.();
    closeModal?.();
  };

  return (
    <div className="select-org">
      {title && <h3 className="select-org__title">{title}</h3>}
      {message && <p className="select-org__msg">{message}</p>}

      {(!options || options.length === 0) ? (
        <p className="select-org__empty">No hay organizaciones disponibles.</p>
      ) : (
        <ul className="select-org__list">
          {options.map((o) => {
            const active = selected === o.orgId;
            return (
              <li key={o.orgId}>
                <button
                  type="button"
                  className={`select-org__item ${active ? 'is-active' : ''}`}
                  onClick={() => handleChoose(o.orgId)}
                >
                  <div className="select-org__info">
                    <span className="select-org__name">{o.nombre || 'Organización'}</span>
                    {o.rol && <span className="select-org__role">({o.rol})</span>}
                  </div>
                  <span className="select-org__radio" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="modal-actions select-org__actions">
        <button
          type="button"
          className="btn-primary"
          disabled={!selected}
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
        <button type="button" className="btn-secondary" onClick={handleCancel}>
          {cancelText}
        </button>
      </div>
    </div>
  );
}
