// src/modules/core/hooks/useRegisterAccount.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, googleLogin } from '../../../api/core';
import useToast from '../../../shared/hooks/useToast';
import useModal from '../../../shared/hooks/useModal';
import useAuth from '../../../shared/hooks/useAuth';
import { handleApiError } from '../../../shared/utils/handleApiError';
import {
  normalizeName,
  emailRegex,
  getPasswordValidations,
  allPasswordValid
} from '../utils/authHelpers';

export default function useRegisterAccount() {
  const { login: loginUser } = useAuth();
  const { showToast } = useToast();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [repeat, setRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const passwordValidations = getPasswordValidations(form.password);
  const isPasswordValid = allPasswordValid(form.password);

  const validate = useCallback(() => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!form.apellido.trim()) e.apellido = 'El apellido es obligatorio';
    if (!emailRegex.test(form.email)) e.email = 'Correo inválido';

    if (!form.password) e.password = 'La contraseña es obligatoria';
    else if (!isPasswordValid) e.password = 'La contraseña no cumple los requisitos';

    if (repeat !== form.password) e.repeat = 'Las contraseñas no coinciden';
    return e;
  }, [form, repeat, isPasswordValid]);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault?.();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    try {
      setLoading(true);
      const cleanData = {
        ...form,
        nombre: normalizeName(form.nombre),
        apellido: normalizeName(form.apellido),
      };

      const { data } = await register(cleanData);

      if (data?.pendingToken) localStorage.setItem('pendingToken', data.pendingToken);
      localStorage.setItem('emailRegistrado', form.email);

      showModal({
        title: 'Registro iniciado',
        message: data?.message || 'Continuá con los datos de tu organización.',
      });

      navigate('/register/organization');
    } catch (err) {
      handleApiError(err, showToast, setErrors, showModal);
    } finally {
      setLoading(false);
    }
  }, [form, navigate, showModal, showToast, validate]);

  /**
   * Acepta:
   * - { code }    → Auth Code Flow (el backend hace exchange con Google)
   * - { idToken } → One Tap / token directo (menos recomendado)
   */
  const handleGoogleOAuth = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        const { code, idToken } = payload || {};

        if (!code && !idToken) {
          showToast('No se obtuvo credencial de Google', 'error');
          return;
        }

        const { data } = await googleLogin(code ? { code } : { idToken });

        // Cuenta nueva sin membresías → paso 2
        if (data?.code === 'ACCOUNT_CREATED_NO_ORG' && data?.pendingToken) {
          localStorage.setItem('pendingToken', data.pendingToken);
          showModal({
            title: 'Cuenta creada',
            message: 'Continuá creando o uniéndote a una organización.',
          });
          navigate('/register/organization');
          return;
        }

        // Login directo (cookie httpOnly ya seteada)
        if (data?.success && data?.user) {
          loginUser(data.user);
          showToast('Sesión iniciada con Google', 'success');
          navigate('/');
          return;
        }

        // Varias organizaciones
        if (data?.code === 'MULTIPLE_ORGS' && Array.isArray(data.options) && data.options.length) {
          showModal({
            type: 'select-org',
            title: 'Seleccioná una organización',
            message: 'Tu cuenta pertenece a varias organizaciones. Elegí una para continuar.',
            options: data.options,
            onSelect: async (orgId) => {
              try {
                setLoading(true);
                const { data: again } = await googleLogin(
                  code ? { code, orgId } : { idToken, orgId }
                );
                loginUser(again.user);
                showToast('Sesión iniciada con Google', 'success');
                navigate('/');
              } catch (e2) {
                handleApiError(e2, showToast, setErrors, showModal);
              } finally {
                setLoading(false);
              }
            },
          });
          return;
        }

        // Usuario existente sin membresías
        if (data?.code === 'NO_ORG_MEMBERSHIP') {
          showModal({
            title: 'Falta unirse a una organización',
            message: 'Creá o uníte a una organización para continuar.',
          });
          navigate('/register/organization');
          return;
        }

        showToast('No se pudo completar el inicio con Google', 'error');
      } catch (err) {
        handleApiError(err, showToast, setErrors, showModal);
      } finally {
        setLoading(false);
      }
    },
    [loginUser, navigate, showModal, showToast]
  );

  const onGoogleError = useCallback(() => {
    showToast('No se pudo iniciar con Google', 'error');
  }, [showToast]);

  return {
    form, setForm,
    repeat, setRepeat,
    loading, errors, setErrors,
    passwordValidations, isPasswordValid,
    handleSubmit,
    handleGoogleOAuth,
    onGoogleError,
  };
}