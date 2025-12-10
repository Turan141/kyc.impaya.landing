import { useLogger } from 'src/contexts/LoggerContext';

export function MobileConsole() {
    const { logs } = useLogger();

    return (
        <div
            style={{
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                height: '10vh',
                overflowY: 'auto',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '5px',
                fontFamily: 'monospace',
                fontSize: '12px',
                zIndex: 9999
            }}
        >
            {logs.map((log, index) => (
                <div key={index}>{log}</div>
            ))}
        </div>
    );
}