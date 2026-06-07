import React, { useState, useEffect } from 'react';

function LoadingScreen({ onFinished }) {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        // Start fading out after 1.5 seconds
        const fadeTimer = setTimeout(() => {
            setFade(true);
        }, 1500);

        // Fully unmount after the fade transition completes (2.0s total)
        const finishTimer = setTimeout(() => {
            onFinished();
        }, 2000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinished]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'radial-gradient(circle at center, #0b1120 0%, #030712 100%)',
            zIndex: 9999,
            transition: 'opacity 0.5s ease, visibility 0.5s ease',
            opacity: fade ? 0 : 1,
            visibility: fade ? 'hidden' : 'visible',
            pointerEvents: 'none'
        }}>
            <div className="spinner-3d-wrapper">
                <div className="spinner-3d">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <div className="loading-text" style={{ marginTop: '30px', fontSize: '1rem', letterSpacing: '0.1em' }}>
                    Initializing Secure Portal...
                </div>
            </div>
        </div>
    );
}

export default LoadingScreen;
