import { useState } from 'react';

export const usePasswordToggle = (initial = false) => {
  const [showPassword, setShowPassword] = useState(initial);
  const toggle = () => setShowPassword((prev) => !prev);
  return { showPassword, toggleShowPassword: toggle };
};
