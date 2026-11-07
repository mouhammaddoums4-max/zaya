"use client";

import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Torus } from "@react-three/drei";
import { Suspense } from "react";

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-5, -2, -3]} intensity={30} color="#F26B21" />
      <pointLight position={[4, 3, 2]} intensity={20} color="#FF8A3D" />

      {/* Sphère centrale distordue — le "soleil" ZAYA */}
      <Float speed={1.4} rotationIntensity={0.9} floatIntensity={1.1}>
        <mesh scale={1.65}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color="#F26B21"
            distort={0.38}
            speed={1.8}
            roughness={0.25}
            metalness={0.35}
          />
        </mesh>
      </Float>

      {/* Anneau orbital */}
      <Float speed={1} rotationIntensity={0.6} floatIntensity={0.6}>
        <Torus args={[2.6, 0.06, 16, 100]} rotation={[1.4, 0.3, 0]}>
          <meshStandardMaterial color="#FF8A3D" metalness={0.6} roughness={0.3} />
        </Torus>
      </Float>

      {/* Satellites géométriques */}
      <Float speed={2.2} rotationIntensity={1.4} floatIntensity={1.6}>
        <Icosahedron args={[0.42, 0]} position={[2.6, 1.3, -1]}>
          <meshStandardMaterial color="#141416" metalness={0.5} roughness={0.4} />
        </Icosahedron>
      </Float>
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.3}>
        <Icosahedron args={[0.3, 0]} position={[-2.7, -1.1, 0.5]}>
          <meshStandardMaterial color="#FFC199" metalness={0.3} roughness={0.5} />
        </Icosahedron>
      </Float>
      <Float speed={2.6} rotationIntensity={1} floatIntensity={2}>
        <Icosahedron args={[0.22, 0]} position={[1.9, -1.6, 1]}>
          <meshStandardMaterial color="#F26B21" metalness={0.4} roughness={0.3} />
        </Icosahedron>
      </Float>
    </>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
