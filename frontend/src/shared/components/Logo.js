// src/shared/components/Logo.jsx
import PropTypes from 'prop-types';
import icon from '../../assets/img/logo-icon.webp';   
import text from '../../assets/img/logo-text.webp';   
import { useNavigate } from 'react-router-dom';

export default function Logo({ showIcon = true, showText = true, horizontal = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div
      className={`logo ${horizontal ? 'logo-horizontal' : 'logo-vertical'}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {showIcon && <img src={icon} alt="FedesCRM Icon" className="logo-icon" />}
      {showText && <img src={text} alt="FedesCRM Text" className="logo-text" />}
    </div>
  );
}

Logo.propTypes = {
  showIcon: PropTypes.bool,
  showText: PropTypes.bool,
  horizontal: PropTypes.bool,
};