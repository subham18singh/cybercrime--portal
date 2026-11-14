import React, { useEffect, useRef } from 'react';

/**
 * CyberGridBackground
 * Interactive canvas-based dynamic cyber particle grid with glowing nodes,
 * connecting telemetry lines, and futuristic ambient glow.
 */
export const CyberGridBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate cyber nodes
    const nodeCount = Math.min(Math.floor((width * height) / 22000), 55);
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1,
        color: i % 3 === 0 ? '#E6325B' : i % 3 === 1 ? '#0F172A' : '#94A3B8',
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.08;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(230, 50, 91, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Radial vignette glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-cyber-cyan/10 via-cyber-blue/5 to-transparent blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-[600px] h-[450px] bg-cyber-violet/10 blur-[140px] rounded-full pointer-events-none" />
      
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block opacity-70" />
      
      {/* Subtle Digital Grid Overlay */}
      <div className="absolute inset-0 bg-cyber-grid-dense opacity-40 pointer-events-none" />
    </div>
  );
};

export default CyberGridBackground;
