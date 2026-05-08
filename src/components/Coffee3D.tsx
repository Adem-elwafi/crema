import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Declare global Three.js types to avoid TypeScript errors
declare global {
  interface Window {
    THREE?: typeof import('three')
  }
}

gsap.registerPlugin(ScrollTrigger)

const Coffee3D = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true
    let cleanupScene: (() => void) | undefined

    const initThreeJS = async () => {
      if (!containerRef.current || !mounted) return

      try {
        const THREE = await import('three')

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
          50,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000
        )

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        renderer.setClearColor(0x000000, 0)
        containerRef.current.appendChild(renderer.domElement)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.65)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffd7a3, 1.1)
        directionalLight.position.set(5, 5, 5)
        scene.add(directionalLight)

        const fillLight = new THREE.PointLight(0x8b4513, 0.45, 12)
        fillLight.position.set(-2, -1, 4)
        scene.add(fillLight)

        const geometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI)
        const material = new THREE.MeshStandardMaterial({
          color: 0x8b4513,
          emissive: 0x3c2a21,
          emissiveIntensity: 0.12,
          roughness: 0.48,
          metalness: 0.18,
        })

        const coffeeBean = new THREE.Mesh(geometry, material)
        coffeeBean.scale.set(1.6, 1.1, 0.95)
        coffeeBean.rotation.z = 0.35
        scene.add(coffeeBean)

        camera.position.z = 4.35

        const triggerElement = containerRef.current.closest('section') ?? containerRef.current
        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })

        scrollTimeline.to(
          coffeeBean.rotation,
          {
            y: Math.PI * 7,
            x: 0.55,
            z: 0.15,
            ease: 'none',
          },
          0
        )
        scrollTimeline.to(
          coffeeBean.position,
          {
            x: 1.2,
            y: -0.25,
            ease: 'none',
          },
          0
        )
        scrollTimeline.to(
          coffeeBean.scale,
          {
            x: 1.8,
            y: 1.2,
            z: 1.05,
            ease: 'none',
          },
          0
        )

        const animate = () => {
          if (!mounted) return

          coffeeBean.rotation.y += 0.004
          coffeeBean.rotation.x = Math.sin(Date.now() * 0.001) * 0.08

          renderer.render(scene, camera)
          animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
          if (!containerRef.current || !mounted) return

          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        }

        window.addEventListener('resize', handleResize)

        cleanupScene = () => {
          window.removeEventListener('resize', handleResize)
          scrollTimeline.scrollTrigger?.kill()
          scrollTimeline.kill()
          if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current)
          }
          geometry.dispose()
          material.dispose()
          renderer.dispose()
          if (renderer.domElement.parentElement) {
            renderer.domElement.parentElement.removeChild(renderer.domElement)
          }
        }
      } catch (error) {
        console.error('Failed to initialize Three.js:', error)
      }
    }

    void initThreeJS()

    return () => {
      mounted = false
      cleanupScene?.()
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none opacity-100"
      aria-hidden="true"
    />
  );
};

export default Coffee3D;