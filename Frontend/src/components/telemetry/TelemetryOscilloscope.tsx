import { useEffect, useRef } from 'react';
import { FrameData } from '@/lib/api';

interface TelemetryOscilloscopeProps {
    data: FrameData[];
    currentIndex: number;
    selectedDriver: string;
    windowSize?: number; // Number of frames to show? Or seconds? Let's say frames for now (25 fps)
}

export const TelemetryOscilloscope = ({ data, currentIndex, selectedDriver, windowSize = 100 }: TelemetryOscilloscopeProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !data || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Clear
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Horizontal lines
        for (let i = 0; i < 5; i++) {
            const y = (rect.height / 4) * i;
            ctx.moveTo(0, y);
            ctx.lineTo(rect.width, y);
        }
        // Vertical lines
        for (let i = 0; i < 10; i++) {
            const x = (rect.width / 10) * i;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, rect.height);
        }
        ctx.stroke();

        // Data Extraction
        // We want to show [currentIndex - windowSize, currentIndex]
        // Or maybe centered? User request: "Scrolls left -> right in time". usually means new data appears on right.

        const startIndex = Math.max(0, currentIndex - windowSize + 1);
        const renderData = [];

        for (let i = startIndex; i <= currentIndex; i++) {
            const frame = data[i];
            if (frame && frame.drivers[selectedDriver]) {
                renderData.push(frame.drivers[selectedDriver]);
            } else {
                renderData.push(null); // padding if driver not present
            }
        }

        // Padding at start if needed
        if (currentIndex < windowSize) {
            const padding = windowSize - renderData.length;
            // actually we probably just want to draw what we have
        }

        const stepX = rect.width / (windowSize - 1);

        // Helper to draw channel
        const drawChannel = (getValue: (d: any) => number, color: string, maxValue: number, stepped = false) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();

            let started = false;

            renderData.forEach((d, i) => {
                if (!d) return;

                const val = getValue(d);
                const normalized = Math.max(0, Math.min(1, val / maxValue));
                const x = i * stepX + (rect.width - (renderData.length * stepX)); // Right align
                const y = rect.height - (normalized * rect.height * 0.9) - (rect.height * 0.05); // 5% padding bottom

                if (stepped) {
                    if (!started) {
                        ctx.moveTo(x, y);
                        started = true;
                    } else {
                        const prevD = renderData[i - 1];
                        if (prevD) {
                            const prevVal = getValue(prevD);
                            const prevNorm = Math.max(0, Math.min(1, prevVal / maxValue));
                            const prevY = rect.height - (prevNorm * rect.height * 0.9) - (rect.height * 0.05);
                            ctx.lineTo(x, prevY); // Horizontal step
                            ctx.lineTo(x, y); // Vertical jump
                        } else {
                            ctx.moveTo(x, y);
                        }
                    }
                } else {
                    if (!started) {
                        ctx.moveTo(x, y);
                        started = true;
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            });
            ctx.stroke();
        };

        // Draw Channels
        // Speed (Green) - Max ~350
        drawChannel(d => d.speed, 'hsl(140, 100%, 55%)', 350);

        // Throttle (Orange) - Max 100
        drawChannel(d => d.throttle, 'hsl(30, 100%, 60%)', 100);

        // Brake (Red) - Max 100
        drawChannel(d => d.brake, 'hsl(0, 100%, 65%)', 100);


        // Draw current time indicator (Vertical line at right edge?)
        // Or if we are "scrolling", new data is at the right edge.
        // So the "Cursor" is effectively the right edge.

    }, [data, currentIndex, selectedDriver, windowSize]);

    return (
        <div className="w-full h-full bg-black/50 border border-white/10 rounded-lg overflow-hidden relative">
            <div className="absolute top-2 left-2 flex flex-col gap-1 text-[10px] font-mono pointer-events-none z-10">
                <span className="text-[hsl(140,100%,55%)] font-bold">kW/h [SPEED]</span>
                <span className="text-[hsl(30,100%,60%)] font-bold">THROTTLE %</span>
                <span className="text-[hsl(0,100%,65%)] font-bold">BRAKE %</span>
            </div>
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
        </div>
    );
};
