import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Bean, Flame, Clock3, Droplets } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    title: 'Selection',
    icon: Bean,
    description:
      'We source small, expressive lots and cup them side by side until the clearest flavor profile emerges.',
  },
  {
    title: 'Roasting',
    icon: Flame,
    description:
      'Heat is tuned in measured phases so caramelization builds without flattening the coffee’s structure.',
  },
  {
    title: 'Resting',
    icon: Clock3,
    description:
      'The roast rests before grinding, allowing aromatics to settle and the cup to open with more precision.',
  },
  {
    title: 'Brewing',
    icon: Droplets,
    description:
      'A controlled pour or press reveals layered sweetness, clarity, and a long amber finish.',
  },
]

const BrewingRitual = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!contentRef.current || !sectionRef.current) return;

    // Viewport enter: Fade in and slide up
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.5,
        }
      }
    );

    // Viewport exit: Fade out and slide up
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -60,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'bottom 80%',
        end: 'bottom 35%',
        scrub: 1.5,
      }
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="ritual"
      className="scroll-mt-24 bg-transparent px-6 py-32 md:px-12 md:py-48 min-h-screen flex items-center justify-center"
    >
      <div ref={contentRef} className="mx-auto max-w-6xl w-full">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
            Brewing Ritual
          </p>
          <h2 className="text-3xl font-light tracking-tight text-white md:text-5xl">
            Every cup moves through a quiet sequence of selection, heat, rest, and extraction.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <article
                key={step.title}
                className="group rounded-[1.75rem] border border-white/10 bg-neutral-950/65 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-neutral-900/85"
              >
                <div className="mb-12 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                    0{index + 1}
                  </span>
                  <div className="rounded-full border border-amber-600/20 bg-amber-600/10 p-3 text-amber-500 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mb-4 text-2xl font-light tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-7 text-neutral-300">
                  {step.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BrewingRitual
