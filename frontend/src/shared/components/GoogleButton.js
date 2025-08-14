// src/shared/components/GoogleButton.jsx
import { FaGoogle } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import PropTypes from 'prop-types';

export default function GoogleButton({ text, disabled, onSuccess, onError }) {
  const googlePopup = useGoogleLogin({
    flow: 'auth-code',                 // usamos auth-code + PKCE
    scope: 'openid email profile',
    onSuccess: (resp) => resp?.code ? onSuccess({ code: resp.code }) : onError?.(),
    onError: () => onError?.(),
  });

  return (
    <button type="button" className="google-btn" disabled={disabled} onClick={() => googlePopup()}>
      <FaGoogle className="google-icon" />
      {text}
    </button>
  );
}

GoogleButton.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onSuccess: PropTypes.func.isRequired, // onSuccess({ code })
  onError: PropTypes.func,
};

GoogleButton.defaultProps = {
  disabled: false,
  onError: undefined,
};
