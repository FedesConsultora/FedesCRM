  import { useState } from 'react';

  export default function TwoFAForm({ onSubmit, loading }) {
    const [token2FA, setToken2FA] = useState('');

    const handleSubmit = (e) => {
      e?.preventDefault?.();
      if (!token2FA) return;
      onSubmit({ token2FA });
    };

    return (
      <>
        <label htmlFor="token2FA" className="sr-only">Código 2FA</label>
        <input
          id="token2FA"
          name="token2FA"
          placeholder="Código 2FA"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          autoComplete="one-time-code"
          value={token2FA}
          onChange={(e) => setToken2FA(e.target.value.replace(/\D/g, ''))}
          disabled={loading}
          required
        />

        {/* Permite enviar con Enter */}
        <button
          type="button"
          style={{ display: 'none' }}
          onClick={handleSubmit}
          aria-hidden
        />
      </>
    );
  }
