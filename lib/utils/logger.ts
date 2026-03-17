type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  message: string;
  level: LogLevel;
  timestamp: string;
  context?: Record<string, any>;
}

export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    log('info', message, context);
  },
  warn: (message: string, context?: Record<string, any>) => {
    log('warn', message, context);
  },
  error: (message: string, context?: Record<string, any>) => {
    log('error', message, context);
  },
};

function log(level: LogLevel, message: string, context?: Record<string, any>) {
  const payload: LogPayload = {
    message,
    level,
    timestamp: new Date().toISOString(),
    context,
  };

  // In production, this could be sent to a service like Sentry, Logtail, or Axiom
  if (process.env.NODE_ENV === 'production') {
    // For now, we use structured console logging which is picked up by Vercel/CloudWatch
    console.log(JSON.stringify(payload));
  } else {
    const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[32m';
    console.log(`${color}[${level.toUpperCase()}]\x1b[0m ${message}`, context || '');
  }
}
