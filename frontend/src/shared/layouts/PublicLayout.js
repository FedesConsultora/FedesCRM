// src/shared/layouts/PublicLayout.jsx
import fondoVideo from '../../assets/video/fondoVideo.webm';

export default function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      {/* Video de fondo */}
      <video className="background-video" autoPlay loop muted playsInline>
        <source src={fondoVideo} type="video/webm" />
        Tu navegador no soporta el video de fondo.
      </video>

      <main>{children}</main>
    </div>
  );
}
