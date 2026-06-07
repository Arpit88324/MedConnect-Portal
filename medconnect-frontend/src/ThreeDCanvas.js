import React, { useEffect, useRef } from 'react';

function ThreeDCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Adjust canvas dimension size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Particle configuration settings
        const particleCount = 100;
        const particles = [];
        const maxDistance = 140;
        const cameraDepth = 400;

        // Rotation angles and interactive coordinates
        let mouseX = 0;
        let mouseY = 0;
        let targetRotateX = 0;
        let targetRotateY = 0;
        let rotateX = 0;
        let rotateY = 0;

        // Generate points in a 3D sphere shape
        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const radius = 160 + Math.random() * 140;

            particles.push({
                x: radius * Math.sin(phi) * Math.cos(theta),
                y: radius * Math.sin(phi) * Math.sin(theta),
                z: radius * Math.cos(phi),
                color: i % 2 === 0 ? 'rgba(14, 165, 233, ' : 'rgba(79, 70, 229, '
            });
        }

        // Track user mouse trajectory
        const handleMouseMove = (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.002;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.002;
            targetRotateY = mouseX;
            targetRotateX = mouseY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Standard drift speed
        let deltaY = 0.001;
        let deltaX = 0.0005;

        // Render loop
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Smooth cursor dampening (lerping)
            rotateY += (targetRotateY - rotateY) * 0.05;
            rotateX += (targetRotateX - rotateX) * 0.05;

            const currentAngleY = deltaY + rotateY * 0.4;
            const currentAngleX = deltaX + rotateX * 0.4;

            const cosY = Math.cos(currentAngleY);
            const sinY = Math.sin(currentAngleY);
            const cosX = Math.cos(currentAngleX);
            const sinX = Math.sin(currentAngleX);

            const projected = [];

            // Project coordinate array
            particles.forEach((p) => {
                // Apply rotation matrices
                const x1 = p.x * cosY - p.z * sinY;
                const z1 = p.z * cosY + p.x * sinY;

                const y1 = p.y * cosX - z1 * sinX;
                const z2 = z1 * cosX + p.y * sinX;

                // Mutate positions to continue rotating
                p.x = x1;
                p.y = y1;
                p.z = z2;

                // Transform 3D coordinates to 2D screen projections
                const factor = cameraDepth / (cameraDepth + z2 + 250); 
                const projX = x1 * factor + canvas.width / 2;
                const projY = y1 * factor + canvas.height / 2;

                projected.push({
                    x: projX,
                    y: projY,
                    z: z2,
                    scale: factor,
                    color: p.color
                });
            });

            // Draw line webs
            for (let i = 0; i < projected.length; i++) {
                for (let j = i + 1; j < projected.length; j++) {
                    const p1 = projected[i];
                    const p2 = projected[j];

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const alpha = (1 - distance / maxDistance) * 0.18 * p1.scale;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }

            // Draw particles nodes
            projected.forEach((p) => {
                const radius = Math.max(0.5, (p.z + 300) * 0.006);
                const alpha = Math.max(0.05, (p.z + 300) / 600) * 0.7;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}${alpha})`;
                ctx.fill();
            });

            // Rotate a tiny bit each frame
            deltaY = 0.001;
            deltaX = 0.0005;

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
                background: 'radial-gradient(circle at center, #0b1120 0%, #030712 100%)',
            }}
        />
    );
}

export default ThreeDCanvas;
