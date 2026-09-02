"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// the vertex shader just passes each pixel's screen position (uv) through
// unchanged, all the actual visual work happens in the fragment shader below:
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// uniform means "a value passed in from outside the shader, from JavaScript"
//  u_time, u_resolution, u_mouse are the three required uniforms.
// varying vec2 vUv is a value that's different for every pixel, it comes from the vertex shader (that just passes uv through unchanged), and holds this specific pixel's screen coordinate.
const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  varying vec2 vUv;

  void main() {
    // uv goes from (0,0) at bottom-left to (1,1) at top-right of the screen
    vec2 uv = vUv;

    // correct for aspect ratio so the wave doesn't stretch on wide screens
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    // bend the wave gently toward the mouse's horizontal position
    float mouseInfluence = (u_mouse.x - 0.5) * 0.3;

    // a slow, layered sine wave — u_time makes it shift over time,
    // uv.x makes it vary across the screen horizontally

    //  This is the actual animated shape. sin() produces a smooth up-and-down oscillating value between -1 and 1.
    //  uv.x * 3.0 means the wave completes roughly 3 cycles across the screen horizontally (higher number = more ripples). 
    // + u_time * 0.4 shifts the wave sideways continuously as time increases, this is what makes it animate rather than sit still. 
    // * 0.15 scales down how tall the wave's peaks/troughs are. 
    
    float wave = sin((uv.x + mouseInfluence) * 3.0 + u_time * 0.4) * 0.15;
    wave += sin((uv.x + mouseInfluence) * 6.0 - u_time * 0.25) * 0.08;

    // how far this pixel's vertical position is from the wave's center line
    float dist = uv.y - 0.5 - wave;

    //vec3 here represents an RGB color. it blends between two colors (your zinc/violet palette) based on that distance
    
    vec3 colorTop = vec3(0.545, 0.361, 0.965); // violet-500
    vec3 colorBottom = vec3(0.055, 0.055, 0.067); // zinc-950
    vec3 color = mix(colorBottom, colorTop, smoothstep(-0.3, 0.3, dist));

    gl_FragColor = vec4(color, 1.0);
  }
`;

const WaveMaterial = shaderMaterial(
  {
    u_time: 0,
    u_resolution: new THREE.Vector2(1, 1),
    u_mouse: new THREE.Vector2(0.5, 0.5),
  },
  vertexShader,
  fragmentShader,
);

extend({ WaveMaterial });

function WavePlane({ mouse }) {
  const materialRef = useRef(null);
  const { size } = useThree();
  // tracks whether this browser tab is currently visible, so we can skip
  // updating the animation when it's hidden — no point burning GPU/battery
  // on something nobody can see
  const isVisible = useRef(true);

  useEffect(() => {
    function handleVisibilityChange() {
      isVisible.current = document.visibilityState === "visible";
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useFrame((state) => {
    if (!materialRef.current || !isVisible.current) return;
    materialRef.current.u_time = state.clock.getElapsedTime();
    materialRef.current.u_resolution.set(size.width, size.height);
    materialRef.current.u_mouse.set(mouse.current.x, mouse.current.y);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <waveMaterial ref={materialRef} />
    </mesh>
  );
}

export default function ShaderHero() {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    // cap devicePixelRatio at 1.5 — high-DPI screens (e.g. 3x retina) would
    // otherwise force the GPU to render far more pixels than needed here
    setDpr(Math.min(window.devicePixelRatio, 1.5));
  }, []);

  function handlePointerMove(e) {
    mouse.current = {
      x: e.clientX / window.innerWidth,
      y: 1 - e.clientY / window.innerHeight,
    };
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className="relative h-full w-full overflow-hidden"
    >
      <Canvas dpr={dpr} orthographic camera={{ zoom: 1, position: [0, 0, 1] }}>
        <WavePlane mouse={mouse} />
      </Canvas>
      {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-white drop-shadow-lg">
          GitHub Analyzer
        </h1>
        <p className="text-sm text-zinc-200 drop-shadow-lg mt-1">
          Understand any developer's activity at a glance.
        </p>
      </div> */}
    </div>
  );
}