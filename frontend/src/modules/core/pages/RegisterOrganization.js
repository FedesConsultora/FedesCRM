// src/modules/core/pages/RegisterOrganization.jsx
import Logo from '../../../shared/components/Logo';
import useRegisterOrganization from '../hooks/useRegisterOrganization';
import { SECTORS } from '../utils/orgHelpers';

export default function RegisterOrganization() {
  const {
    tab, setTab,
    creating, joining,
    errorsCreate, setErrorsCreate,
    errorsJoin, setErrorsJoin,
    createForm, setCreateForm,
    joinForm, setJoinForm,
    handleCreate, handleJoin
  } = useRegisterOrganization();

  return (
    <div className="register-container">
      <div className="auth-card org">
        <Logo showIcon showText vertical />
        <h2 className="tituloLogin">Tu organización</h2>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`tab ${tab === 'crear' ? 'is-active' : ''}`}
            onClick={() => setTab('crear')}
          >
            Crear organización
          </button>
          <button
            type="button"
            className={`tab ${tab === 'unirme' ? 'is-active' : ''}`}
            onClick={() => setTab('unirme')}
          >
            Unirme a una organización
          </button>
        </div>

        {/* --- Crear organización --- */}
        {tab === 'crear' && (
          <form onSubmit={handleCreate} noValidate className="org-section org-create-grid">
            <div>
              <label>Nombre de la empresa</label>
              <input
                type="text"
                placeholder="Nombre de la empresa"
                value={createForm.nombre}
                onChange={(e) => {
                  setCreateForm({ ...createForm, nombre: e.target.value });
                  if (errorsCreate.nombre) setErrorsCreate({ ...errorsCreate, nombre: '' });
                }}
                className={errorsCreate.nombre ? 'is-invalid' : ''}
              />
              {errorsCreate.nombre && <span className="field-error">{errorsCreate.nombre}</span>}
            </div>

            <div>
              <label>Dominio corporativo</label>
              <input
                type="text"
                placeholder="ej: fedes.com"
                value={createForm.dominio}
                onChange={(e) => {
                  setCreateForm({ ...createForm, dominio: e.target.value });
                  if (errorsCreate.dominio) setErrorsCreate({ ...errorsCreate, dominio: '' });
                }}
                className={errorsCreate.dominio ? 'is-invalid' : ''}
              />
              {errorsCreate.dominio && <span className="field-error">{errorsCreate.dominio}</span>}
            </div>

            <div>
              <label>Sector</label>
              <select
                value={createForm.sector}
                onChange={(e) => {
                  setCreateForm({ ...createForm, sector: e.target.value });
                  if (errorsCreate.sector) setErrorsCreate({ ...errorsCreate, sector: '' });
                }}
                className={errorsCreate.sector ? 'is-invalid' : ''}
              >
                <option value="">Seleccione el sector</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errorsCreate.sector && <span className="field-error">{errorsCreate.sector}</span>}
            </div>

            <div>
              <label>Consultas por mes (opcional)</label>
              <input
                type="number"
                min="0"
                placeholder="Cantidad"
                value={createForm.consultasMes}
                onChange={(e) => {
                  setCreateForm({ ...createForm, consultasMes: e.target.value });
                  if (errorsCreate.consultasMes) setErrorsCreate({ ...errorsCreate, consultasMes: '' });
                }}
                className={errorsCreate.consultasMes ? 'is-invalid' : ''}
              />
              {errorsCreate.consultasMes && <span className="field-error">{errorsCreate.consultasMes}</span>}
            </div>

            <div className="span-2">
              <label>¿Qué problemas buscás resolver con FedesCRM? (opcional)</label>
              <textarea
                placeholder="Máximo 500 caracteres"
                value={createForm.descripcionProblema}
                onChange={(e) => setCreateForm({ ...createForm, descripcionProblema: e.target.value })}
                maxLength={500}
              />
            </div>

            <div className="org-actions span-2">
              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? 'Creando…' : 'Crear y continuar'}
              </button>
            </div>
          </form>
        )}

        {/* --- Unirme a organización --- */}
        {tab === 'unirme' && (
          <form onSubmit={handleJoin} noValidate className="org-section org-join-grid">
            <div>
              <label>Token de invitación</label>
              <input
                type="text"
                placeholder="Si tenés uno"
                value={joinForm.inviteToken}
                onChange={(e) => {
                  setJoinForm({ ...joinForm, inviteToken: e.target.value.trim() });
                  if (errorsJoin.inviteToken) setErrorsJoin({ ...errorsJoin, inviteToken: '' });
                }}
                className={errorsJoin.inviteToken ? 'is-invalid' : ''}
              />
              {errorsJoin.inviteToken && <span className="field-error">{errorsJoin.inviteToken}</span>}
            </div>

            <div className="inline-divider">— o —</div>

            <div>
              <label>Dominio corporativo</label>
              <input
                type="text"
                placeholder="ej: fedes.com"
                value={joinForm.dominio}
                onChange={(e) => {
                  setJoinForm({ ...joinForm, dominio: e.target.value });
                  if (errorsJoin.dominio) setErrorsJoin({ ...errorsJoin, dominio: '' });
                }}
                className={errorsJoin.dominio ? 'is-invalid' : ''}
              />
              {errorsJoin.dominio && <span className="field-error">{errorsJoin.dominio}</span>}
            </div>

            <div className="org-actions">
              <button type="submit" className="btn-primary" disabled={joining}>
                {joining ? 'Enviando…' : 'Unirme / Enviar solicitud'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
