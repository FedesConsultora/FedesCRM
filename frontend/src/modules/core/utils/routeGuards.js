// Devuelve true si hay un pendingToken en localStorage
export const requirePendingToken = () => {
  return Boolean(localStorage.getItem('pendingToken'));
};

// Devuelve true si hay un emailRegistrado en localStorage
export const requireEmailRegistrado = () => {
  return Boolean(localStorage.getItem('emailRegistrado'));
};
