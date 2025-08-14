// src/shared/utils/csrf.js
import api from '../../api/axios';

let CSRF = null;
let loading = false;

export const getCsrfToken = () => CSRF;

export const ensureCsrfTokenLoaded = async () => {
  if (CSRF || loading) return;
  loading = true;
  try {
    const { data } = await api.get('/core/auth/csrf'); // setea cookie y devuelve {csrfToken}
    CSRF = data?.csrfToken || null;
  } finally {
    loading = false;
  }
};

export const clearCsrfToken = () => { CSRF = null; };
