import { useEffect, useRef } from 'react';

// Declare global Three.js types to avoid TypeScript errors
declare global {
  interface Window {
    THREE: any;
  }
}

const Coffee3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    let mounted = true;

    const initThreeJS = async () => {
      if (!containerRef.current || !mounted) return;

      try {
        // Dynamically import Three.js to avoid SSR issues
        const THREE = await import('three');
        
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          50,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000
        );
        
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
        renderer.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
        renderer.setClearColor(0x000000, 0); // Transparent background
        containerRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Create coffee bean geometry
        const geometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI);
        
        // Create material
        const material = new THREE.MeshStandardMaterial({
          color: 0x8B4513,
          emissive: 0x3C2A21,
          emissiveIntensity: 0.1,
          roughness: 0.5,
          metalness: 0.2,
        });

        // Create mesh
        const coffeeBean = new THREE.Mesh(geometry, material);
        scene.add(coffeeBean);

        // Position camera
        camera.position.z = 5;

        // Animation
        const animate = () => {
          if (!mounted) return;
          
          coffeeBean.rotation.y += 0.005;
          coffeeBean.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
          
          renderer.render(scene, camera);
          animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
          if (!containerRef.current || !mounted) return;
          
          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          );
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
          mounted = false;
          window.removeEventListener('resize', handleResize);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement);
          }
          renderer.dispose();
        };

      } catch (error) {
        console.error('Failed to initialize Three.js:', error);
      }
    };

    initThreeJS();

    return () => {
      mounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none opacity-20"
      aria-hidden="true"
    />
  );
};

export default Coffee3D;