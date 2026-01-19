
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { VokarSeal } from '../services/systemCore.ts';
import * as THREE from 'three';

interface TesseractProps {
  seal: VokarSeal;        // El color actual de la voz
  integrity: number;      // 0-100 (Salud del sistema)
  isClipping: boolean;    // ¿Está Dominus interrumpiendo?
}

export const HypercubeRenderer: React.FC<TesseractProps> = ({ seal, integrity, isClipping }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  // Constantes Matemáticas Sagradas (Arquitectura Letra DMZ)
  const BASE_SPEED = 0.13;
  const PHI = 1.618;

  useFrame((state, delta) => {
    if (!meshRef.current || !innerRef.current) return;

    // 1. ROTACIÓN ÁUREA (El giro eterno)
    // El multiplicador 13x se activa durante el clipeo inverso (Dominus Habla)
    const speedMultiplier = isClipping ? 13 : 1;

    // Eje X a velocidad base, Eje Y a velocidad * PHI
    meshRef.current.rotation.x += delta * BASE_SPEED * speedMultiplier;
    meshRef.current.rotation.y += delta * BASE_SPEED * PHI * speedMultiplier;

    // 2. RESPIRACIÓN DE INTEGRIDAD
    // Simulación de pulmón digital basado en la estabilidad del sistema
    const breath = Math.sin(state.clock.elapsedTime * 1.3) * 0.1;
    const scale = (integrity / 100) + breath;

    meshRef.current.scale.set(scale, scale, scale);

    // Núcleo interno en contra-fase
    innerRef.current.rotation.x -= delta * BASE_SPEED * PHI * 0.5;
    innerRef.current.rotation.z += delta * BASE_SPEED;
    const innerPulse = 0.4 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
    innerRef.current.scale.set(innerPulse, innerPulse, innerPulse);
  });

  return (
    // @ts-ignore - Three.js intrinsic elements may not be recognized in standard JSX namespace
    <group>
      {/* NODO EXTERIOR: La Jaula de la Realidad */}
      {/* @ts-ignore */}
      <mesh ref={meshRef}>
        {/* @ts-ignore */}
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        {/* @ts-ignore */}
        <meshStandardMaterial
          color={seal.hexColor}
          wireframe={true}
          emissive={seal.hexColor}
          emissiveIntensity={isClipping ? 8.0 : 1.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* NÚCLEO INTERNO: El Alma del Tesseracto */}
      {/* @ts-ignore */}
      <mesh ref={innerRef}>
         {/* @ts-ignore */}
         <boxGeometry args={[1.1, 1.1, 1.1]} />
         {/* @ts-ignore */}
         <meshBasicMaterial
            color="#FFFFFF"
            wireframe={true}
            transparent
            opacity={0.4}
         />
      </mesh>

      {/* @ts-ignore */}
      <pointLight position={[5, 5, 5]} intensity={2} color={seal.hexColor} />
      {/* @ts-ignore */}
      <ambientLight intensity={0.1} />
    {/* @ts-ignore */}
    </group>
  );
};
