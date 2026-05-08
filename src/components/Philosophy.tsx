import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const Philosophy = () => {
  const philosophyRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      if (!philosophyRef.current) {
        return
      }

      const revealTargets = [eyebrowRef.current, titleRef.current, textRef.current].filter(
        Boolean
      ) as gsap.TweenTarget[]

      gsap.fromTo(
        revealTargets,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: philosophyRef.current,
            start: 'top 78%',
            end: 'bottom 40%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.to([titleRef.current, textRef.current], {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: philosophyRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: philosophyRef }
  )

  return (
    <section
      ref={philosophyRef}
      className="flex items-center justify-center px-6 py-20 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-10 md:mb-12 overflow-hidden">
          <p
            ref={eyebrowRef}
            className="text-sm italic tracking-[0.2em] text-neutral-400 md:text-base"
          >
            More than coffee, it&apos;s a ritual.
          </p>
        </div>

        <h2
          ref={titleRef}
          className="mb-8 text-3xl font-light tracking-tight text-white md:text-5xl"
        >
          Our Philosophy
        </h2>

        <p
          ref={textRef}
          className="text-lg leading-relaxed text-neutral-300 md:text-xl md:leading-loose"
        >
          In a world of constant noise, we believe in the calm ritual of preparation, the quiet
          focus of craftsmanship, and the mindful enjoyment of what is truly essential. Each roast
          is a return to purity-a deliberate, unhurried process that honors the bean&apos;s deepest
          character.
        </p>
      </div>
    </section>
  )
}

export default Philosophy