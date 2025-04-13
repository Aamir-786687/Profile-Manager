import { useEffect } from 'react';

export const useLocalStorage = (key, value) => {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const get = () => JSON.parse(localStorage.getItem(key)) || [];
  return { get };
};
