import React, { useEffect, useRef } from 'react';

// List all caustic frame filenames
const FRAME_COUNT = 240;
const FRAME_PATH = '/Caustic Frames/';
const FRAME_PREFIX = 'caustics1_';
const FRAME_EXT = '.bmp';

function pad(num: number, size: number) {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

const CausticAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const animationRef = useRef<NodeJS.Timeout>();

  // Preload images
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = `${FRAME_PATH}${FRAME_PREFIX}${pad(i, 3)}${FRAME_EXT}`;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        loaded++;
        if (loaded === FRAME_COUNT) {
          imagesRef.current = images;
          startAnimation();
        }
      };
      images.push(img);
    }
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
    // eslint-disable-next-line
  }, []);

  // Animation loop
  function startAnimation() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const fps = 12;
    const interval = 1000 / fps;
    const draw = () => {
      const images = imagesRef.current;
      if (images.length === 0) return;
      const frame = images[frameIndexRef.current % FRAME_COUNT];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      frameIndexRef.current = (frameIndexRef.current + 1) % FRAME_COUNT;
    };
    animationRef.current = setInterval(draw, interval);
    draw();
  }

  // Always render at 1920x1080, scale visually with CSS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 1920;
    canvas.height = 1080;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.5,
        mixBlendMode: 'screen',
        background: 'transparent',
        display: 'block',
      }}
      width={1920}
      height={1080}
      aria-hidden="true"
    />
  );
};

export default CausticAnimation;
