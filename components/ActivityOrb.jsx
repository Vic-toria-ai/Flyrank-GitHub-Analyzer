"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const COLORS = ["#8b5cf6", "#10b981", "#f97316", "#3b82f6"];

function Orb() {
  const meshRef = useRef(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  // runs on every rendered frame 
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.x += delta * 0.1;
    // gently react to cursor hover by scaling up slightly
    const targetScale = hovered ? 1.15 : 1;
    meshRef.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale },
      0.1
    );
  });

  return (
    <mesh
      ref={meshRef}
      onClick={() => setColorIndex((i) => (i + 1) % COLORS.length)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color={COLORS[colorIndex]}
        roughness={0.3}
        metalness={0.4}
        wireframe={hovered}
      />
    </mesh>
  );
}

export default function ActivityOrb() {
  return (
    <div className="h-64 w-full rounded-lg border border-zinc-800 bg-zinc-950">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <Orb />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}