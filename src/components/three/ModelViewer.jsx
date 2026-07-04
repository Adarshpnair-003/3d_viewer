// src/components/three/ModelViewer.jsx
import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Center, Html } from '@react-three/drei';

function Asset({ url }) {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    return () => {
      useGLTF.preload(url);
    };
  }, [url]);

  return <primitive object={scene} />;
}

function CanvasLoader() {
  return (
    <Html center>
      <div className="bg-black border-2 border-white px-6 py-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] pointer-events-none">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-white whitespace-nowrap animate-pulse">
          Loading Geometry...
        </div>
      </div>
    </Html>
  );
}

export default function ModelViewer({ modelUrl }) {
  return (
    <div className="w-full h-full relative group">
      
      <Canvas 
        camera={{ position: [0, 2, 6], fov: 45 }}
        className="touch-none bg-neutral-900"
        shadows
      >
        {/* Softened ambient light for the dark theme */}
        <ambientLight intensity={0.8} />
        
        {/* Crisp directional key light */}
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.5} 
          castShadow 
        />
        
        {/* Clean fill light */}
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.5} 
        />

        <Suspense fallback={<CanvasLoader />}>
          <Center top>
            <Asset url={modelUrl} />
          </Center>
          
          <Environment preset="studio" />
          
          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.6} 
            scale={15} 
            blur={1} 
            far={4} 
            color="#000000" 
          />
        </Suspense>

        <OrbitControls 
          makeDefault 
          autoRotate 
          autoRotateSpeed={0.5} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2} 
          minDistance={2} 
          maxDistance={15} 
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Floating Helper UI */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black border-2 border-white px-4 py-2 flex items-center shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            Drag to Rotate // Scroll to Zoom
          </span>
        </div>
      </div>

    </div>
  );
}