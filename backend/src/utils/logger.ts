export const logger = {
  info: (message: string, metadata?: unknown) => {
    console.log(
      JSON.stringify({
        level: 'INFO',
        message,
        metadata,
        timestamp: new Date().toISOString(),
      })
    );
  },

  warn: (message: string, metadata?: unknown) => {
    console.log(
      JSON.stringify({
        level: 'WARN',
        message,
        metadata,
        timestamp: new Date().toISOString(),
      })
    );
  },

  error: (message: string, metadata?: unknown) => {
    console.error(
      JSON.stringify({
        level: 'ERROR',
        message,
        metadata,
        timestamp: new Date().toISOString(),
      })
    );
  },
};