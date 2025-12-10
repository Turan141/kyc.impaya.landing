import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoggerContextType {
  logs: string[];
}

const LoggerContext = createContext<LoggerContextType>({ logs: [] });

interface LoggerProviderProps {
  children: ReactNode;
}

export function LoggerProvider({ children }: LoggerProviderProps) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info
    };

    console.log = (...args: any[]) => {
      originalConsole.log(...args);
      addLog(args);
    };

    console.warn = (...args: any[]) => {
      originalConsole.warn(...args);
      addLog(args);
    };

    console.error = (...args: any[]) => {
      originalConsole.error(...args);
      addLog(args);
    };

    console.info = (...args: any[]) => {
      originalConsole.info(...args);
      addLog(args);
    };

    function addLog(args: any[]) {
      const logText = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');

      setLogs(prev => [...prev, logText]);
    }

    return () => {
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      console.info = originalConsole.info;
    };
  }, []);

  return (
    <LoggerContext.Provider value={{ logs }}>
      {children}
    </LoggerContext.Provider>
  );
}

export function useLogger() {
  return useContext(LoggerContext);
}