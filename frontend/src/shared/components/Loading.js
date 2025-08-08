// src/shared/components/Loading.jsx
import Lottie from 'lottie-react';
import loadingAnim from '../../assets/video/Loading.json';

export default function Loading({ authCard = false, inline = false }) {
  return (
    <div
      className={`loading-container ${authCard ? 'auth-card' : ''} ${
        inline ? 'inline' : ''
      }`}
    >
      <Lottie animationData={loadingAnim} loop autoplay style={{ width: 150, height: 150 }} />
    </div>
  );
}
