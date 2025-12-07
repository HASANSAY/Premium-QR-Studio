'use client';

import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedY: number;
    opacity: number;
}

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvas boyutunu ayarla
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Parçacıkları oluştur
        const particleCount = 50;
        const particles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedY: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.5 + 0.3,
            });
        }

        // Animasyon loop
        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                // Parçacığı çiz
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

                // Mor gradient renk
                const gradient = ctx.createRadialGradient(
                    particle.x,
                    particle.y,
                    0,
                    particle.x,
                    particle.y,
                    particle.size
                );
                gradient.addColorStop(0, `rgba(167, 139, 250, ${particle.opacity})`); // Light purple
                gradient.addColorStop(1, `rgba(124, 58, 237, ${particle.opacity * 0.5})`); // Dark purple

                ctx.fillStyle = gradient;
                ctx.fill();

                // Parçacığı yukarı hareket ettir
                particle.y -= particle.speedY;

                // Ekran dışına çıkarsa aşağıdan tekrar başlat
                if (particle.y < -particle.size) {
                    particle.y = canvas.height + particle.size;
                    particle.x = Math.random() * canvas.width;
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <Box
            component="canvas"
            ref={canvasRef}
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}
