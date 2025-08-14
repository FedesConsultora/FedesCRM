// src/modules/core/hooks/useRegisterOrganization.js
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerOrg, joinOrgWithToken } from '../../../api/core';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';
import { handleApiError } from '../../../shared/utils/handleApiError';
import { normalizeDomain } from '../utils/orgHelpers';

export default function useRegisterOrganization() {
  const { showToast } = useToast();
  const { showModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Guard extra: si no hay pendingToken → redirigir al paso 1
  useEffect(() => {
    const pendingToken = localStorage.getItem('pendingToken');
    if (!pendingToken) {
      showToast('No se encontró un registro pendiente', 'error');
      navigate('/register');
    }
  }, [navigate, showToast]);

  // ¿viene un token de invitación por query string?
  const inviteFromQS = useMemo(() => {
    const q = new URLSearchParams(location.search);
    return q.get('invite') || '';
  }, [location.search]);

  // Tab: 'crear' | 'unirme'
  const [tab, setTab] = useState(inviteFromQS ? 'unirme' : 'crear');

  // Formularios
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [errorsCreate, setErrorsCreate] = useState({});
  const [errorsJoin, setErrorsJoin] = useState({});

  const [createForm, setCreateForm] = useState({
    nombre: '',
    dominio: '',
    sector: '',
    descripcionProblema: '',
    consultasMes: ''
  });

  const [joinForm, setJoinForm] = useState({
    dominio: '',
    inviteToken: inviteFromQS || ''
  });

  // Preseleccionar tab "Unirme" si hay invite
  useEffect(() => {
    if (inviteFromQS) setTab('unirme');
  }, [inviteFromQS]);

  /* ---------------- Validaciones ---------------- */
  const validateCreate = useCallback(() => {
    const e = {};
    if (!String(createForm.nombre).trim()) e.nombre = 'El nombre de la empresa es obligatorio';
    const dom = normalizeDomain(createForm.dominio);
    if (!dom) e.dominio = 'El dominio es obligatorio';
    else if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(dom)) e.dominio = 'Dominio inválido (ej: fedes.com)';
    if (!String(createForm.sector).trim()) e.sector = 'Seleccioná un sector';
    if (createForm.consultasMes && !/^\d+$/.test(String(createForm.consultasMes))) e.consultasMes = 'Debe ser un número';
    return e;
  }, [createForm]);

  const validateJoin = useCallback(() => {
    const e = {};
    // Puede venir inviteToken **o** dominio; al menos uno
    if (!joinForm.inviteToken && !String(joinForm.dominio).trim()) {
      e.dominio = 'Ingresá dominio o token de invitación';
      e.inviteToken = 'Ingresá dominio o token de invitación';
    }
    return e;
  }, [joinForm]);

  /* ---------------- Handlers ---------------- */
  const handleCreate = useCallback(async (e) => {
    e.preventDefault();
    const clientErrors = validateCreate();
    if (Object.keys(clientErrors).length) {
      setErrorsCreate(clientErrors);
      return;
    }

    const pendingToken = localStorage.getItem('pendingToken');
    if (!pendingToken) {
      showToast('No se encontró el token de registro. Volvé a iniciar el proceso.', 'error');
      navigate('/register');
      return;
    }

    try {
      setCreating(true);
      const payload = {
        pendingToken,
        nombre: String(createForm.nombre).trim(),
        dominio: normalizeDomain(createForm.dominio),
        sector: createForm.sector,
        descripcionProblema: createForm.descripcionProblema?.trim() || undefined,
        consultasMes: createForm.consultasMes ? Number(createForm.consultasMes) : undefined
      };
      const { data } = await registerOrg(payload);

      showModal({
        title: 'Organización creada',
        message: data?.message || 'Revisá tu email para verificar tu cuenta.'
      });
      navigate('/verify-email');
    } catch (err) {
      handleApiError(err, showToast, setErrorsCreate, showModal);
    } finally {
      setCreating(false);
    }
  }, [createForm, navigate, showModal, showToast, validateCreate]);

  const handleJoin = useCallback(async (e) => {
    e.preventDefault();
    const clientErrors = validateJoin();
    if (Object.keys(clientErrors).length) {
      setErrorsJoin(clientErrors);
      return;
    }

    const pendingToken = localStorage.getItem('pendingToken');
    if (!pendingToken) {
      showToast('No se encontró el token de registro. Volvé a iniciar el proceso.', 'error');
      navigate('/register');
      return;
    }

    try {
      setJoining(true);
      const payload = {
        pendingToken,
        inviteToken: joinForm.inviteToken || undefined,
        dominio: joinForm.inviteToken ? undefined : normalizeDomain(joinForm.dominio) || undefined
      };

      const { data } = await joinOrgWithToken(payload);

      showModal({
        title: 'Solicitud enviada',
        message: data?.message || 'Revisá tu email si te pedimos verificación.'
      });
      navigate('/verify-email');
    } catch (err) {
      handleApiError(err, showToast, setErrorsJoin, showModal);
    } finally {
      setJoining(false);
    }
  }, [joinForm, navigate, showModal, showToast, validateJoin]);

  return {
    tab, setTab,
    creating, joining,
    errorsCreate, setErrorsCreate,
    errorsJoin, setErrorsJoin,
    createForm, setCreateForm,
    joinForm, setJoinForm,
    handleCreate, handleJoin
  };
}
