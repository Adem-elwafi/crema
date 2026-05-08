import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
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
  const stepRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    if (!sectionRef.current) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stepRefs.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.16,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            end: 'bottom 45%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="ritual"
      className="scroll-mt-24 bg-[#0f0d0b] px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
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
                ref={(element) => {
                  stepRefs.current[index] = element
                }}
                className="group rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-white/[0.05]"
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
