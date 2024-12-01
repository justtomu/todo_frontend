const getWindowEnvValue = (key: string): string | undefined => {
  if (typeof window !== 'undefined') {
    const windowEnv = (window as any)?.$$environment;
    if (windowEnv !== undefined) {
      return windowEnv[key];
    }
  }

  return undefined;
};

export const getEnvValue = (
  key: string,
  defaultValue?: string
): string | undefined => {
  const processEnvValue = process.env[key];
  if (processEnvValue !== undefined) {
    return processEnvValue;
  }

  const windowEnvValue = getWindowEnvValue(key);
  if (windowEnvValue !== undefined) {
    return windowEnvValue;
  }

  return defaultValue;
};
