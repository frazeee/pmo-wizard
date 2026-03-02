const required = (name, value) => {
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
};

export const ENV = {
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  API_URL: required('VITE_API_URL', import.meta.env.VITE_API_URL),
};