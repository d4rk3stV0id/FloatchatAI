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
  const animationRef = useRef<number>(); // requestAnimationFrame returns a number

  const desiredFpsRef = useRef(45);
  const lastTimeRef = useRef(0);

  // The main drawing function.
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const images = imagesRef.current;
    if (images.length === 0) return;
    const frame = images[frameIndexRef.current % FRAME_COUNT];

    // Clear main canvas for the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Calculate the size of the tiled image
    const imageWidth = frame.naturalWidth;
    const imageHeight = frame.naturalHeight;

    // The scale factor to fit the image vertically without stretching
    const scale = canvas.height / imageHeight;
    const scaledWidth = imageWidth * scale;
    const scaledHeight = imageHeight * scale;

    // Loop to draw the image across the canvas
    for (let y = 0; y < canvas.height; y += scaledHeight) {
      for (let x = 0; x < canvas.width; x += scaledWidth) {
        ctx.drawImage(frame, x, y, scaledWidth, scaledHeight);
      }
    }

    ctx.restore();
    frameIndexRef.current = (frameIndexRef.current + 1) % FRAME_COUNT;
  };

  // The main animation loop using requestAnimationFrame
  const animate = (time: number) => {
    const desiredFps = desiredFpsRef.current;
    const timePerFrame = 1000 / desiredFps;

    // Only draw a new frame if enough time has passed
    if (time - lastTimeRef.current >= timePerFrame) {
      draw();
      lastTimeRef.current = time;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Effect to preload images and start the initial animation
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
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      images.push(img);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line
  }, []);

  // Effect to set canvas dimensions to match the window size dynamically
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  // Effect to handle animation speed changes based on scrolling
  useEffect(() => {
    const normalFps = 45;
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      const speedFactor = Math.min(1 + scrollDelta / 50, 5); // Speed up by up to 5x
      
      desiredFpsRef.current = normalFps * speedFactor;

      lastScrollY = currentScrollY;

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        desiredFpsRef.current = normalFps; // Revert to normal speed
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{
        opacity: 0.5,
        mixBlendMode: 'screen',
        background: 'transparent',
        display: 'block',
      }}
      aria-hidden="true"
    />
  );
};

export default CausticAnimation;