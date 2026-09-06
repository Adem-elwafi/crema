import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Clock, VolumeX, ArrowUpRight } from 'lucide-react';

import qualityCoffeeImg from '../assets/images/features/quality-coffee.jpg';
import freshDeliciousImg from '../assets/images/features/fresh-delicious.jpg';
import cozyAtmosphereImg from '../assets/images/features/cozy-atmosphere.jpg';

gsap.registerPlugin(ScrollTrigger);

interface Chapter {
  id: string;
  index: string;
  tag: string;
  title: string;
  quote: string;
  dropCap: string;
  story: string;
  storyCont: string;
  image: string;
  specs: { label: string; value: string }[];
  icon: typeof Compass;
}

const CHAPTERS: Chapter[] = [
  {
    id: 'sourcing',
    index: '01',
    tag: 'ORIGIN & HARVEST',
    title: 'The Monastic Sourcing',
    quote: 'Coffee is not roasted to be swallowed; it is crafted to arrest the velocity of the morning.',
    dropCap: 'E',
    story:
      'very lot begins on mist-veiled volcanic ridges above 2,100 meters, where Arabica cherries mature in patient, shade-grown stillness. We bypass commodity brokers to partner exclusively with generational growers who hand-select only crimson, brix-dense cherries at peak dawn ripeness.',
    storyCont:
      'In our roastery, we roast on an analog cast-iron drum, relying on olfactory cues and airflow modulation rather than algorithmic presets to unlock vibrant stonefruit acidity and honeyed aromatics.',
    image: qualityCoffeeImg,
    specs: [
      { label: 'ELEVATION', value: '2,100M – 2,350M' },
      { label: 'VARIETAL', value: 'HEIRLOOM TYPICA & BOURBON' },
      { label: 'FERMENT', value: 'NATURAL ANAEROBIC (72H)' },
      { label: 'DRYING', value: 'SUSPENDED AFRICAN BEDS' },
    ],
    icon: Compass,
  },
  {
    id: 'bakery',
    index: '02',
    tag: 'ARTISANAL PATISSERIE',
    title: 'The Dawn Oven',
    quote: 'Long before the city street lamps flicker out, the wild sourdough cultures begin their slow exhale.',
    dropCap: 'B',
    story:
      'ehind frosted glass, our viennoiserie masters work through the quietest hours of the night. Each croissant is laminated with cultured butter from grass-fed Normandy herds, layered through 81 distinct folds across a 72-hour cold retard process to ensure an audible, honeycomb shatter upon bite.',
    storyCont:
      'We grind heritage stoneground grains daily to preserve volatile wheat oils, pairing warm brioches and seasonal galettes with our daily roast profiles.',
    image: freshDeliciousImg,
    specs: [
      { label: 'FERMENT', value: '72H SLOW SOURDOUGH CULT' },
      { label: 'BUTTER', value: '84% AOP NORMANDY BUTTER' },
      { label: 'LAMINATION', value: '81 CRISP FLAKY LAYERS' },
      { label: 'FLOUR', value: 'STONEGROUND ANCIENT SPELT' },
    ],
    icon: Clock,
  },
  {
    id: 'space',
    index: '03',
    tag: 'ACOUSTIC ARCHITECTURE',
    title: 'The Acoustic Sanctuary',
    quote: 'We constructed not just a café, but a physical refusal of contemporary noise and hurry.',
    dropCap: 'S',
    story:
      'tep beyond our threshold and the high-frequency friction of metropolitan life recedes. Crafted with acoustic oak baffles, raw limestone surfaces, and natural daylight orientation, CREMA provides an intentional soundscape where thoughts expand without interference.',
    storyCont:
      'Every ceramic cup is hand-thrown by local potters with deliberate thermal mass, inviting you to linger, read, or contemplate undisturbed for as long as your spirit requires.',
    image: cozyAtmosphereImg,
    specs: [
      { label: 'ACOUSTICS', value: 'NATURAL OAK BAFFLING' },
      { label: 'LIGHTING', value: 'DIFFUSED NORTHERN LUX' },
      { label: 'CERAMICS', value: 'HAND-THROWN HIGH-IRON' },
      { label: 'ATMOSPHERE', value: 'UNHURRIED MEDITATIVE' },
    ],
    icon: VolumeX,
  },
];

export default function EditorialStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftImagesRef = useRef<HTMLDivElement>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Create ScrollTriggers for each chapter on desktop
      const chapterEls = gsap.utils.toArray<HTMLElement>('.editorial-chapter');

      chapterEls.forEach((el, index) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActiveChapterIndex(index),
          onEnterBack: () => setActiveChapterIndex(index),
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const activeChapter = CHAPTERS[activeChapterIndex];

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="relative w-full bg-[#FDF8F3] text-brown-900 overflow-hidden"
    >
      {/* Anchor shim for legacy #about links */}
      <span id="about" className="absolute top-0 pointer-events-none" />

      {/* DESKTOP SPLIT EDITORIAL VIEW (>= 1024px) */}
      <div className="hidden lg:flex w-full min-h-screen">
        {/* Left Column: Pinned Sticky Visual Portal (52% width) */}
        <div className="w-[52%] h-screen sticky top-0 p-8 xl:p-12 flex flex-col justify-between overflow-hidden border-r border-brown-200/50 bg-[#F5EDE4]/60">
          {/* Top Stamp */}
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-accent">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>03 / EDITORIAL ARCHIVE</span>
            </div>
            <span className="text-brown-400">CHAPTER {activeChapter.index} OF 03</span>
          </div>

          {/* Central Image Canvas with Morphing Transitions */}
          <div
            ref={leftImagesRef}
            className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl my-auto border border-brown-900/10 group"
          >
            {CHAPTERS.map((chap, idx) => (
              <div
                key={chap.id}
                className={`absolute inset-0 transition-all duration-1000 ease-out ${
                  idx === activeChapterIndex
                    ? 'opacity-100 scale-100 filter-none pointer-events-auto'
                    : 'opacity-0 scale-105 pointer-events-none'
                }`}
              >
                <img
                  src={chap.image}
                  alt={chap.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-transparent to-black/10" />

                {/* Floating Chapter Badge */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest text-brown-900 shadow-sm uppercase">
                  {chap.tag}
                </div>

                {/* Technical Spec Sheet Overlay at bottom of photo */}
                <div className="absolute bottom-6 inset-x-6 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#1C100B]/85 backdrop-blur-md border border-[#C8956C]/20 text-cream">
                  {chap.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="font-mono">
                      <span className="text-[10px] text-accent/80 tracking-wider block uppercase">
                        {spec.label}
                      </span>
                      <span className="text-xs text-cream/90 font-medium tracking-wide">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Footnote */}
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-brown-400">
            <span>CREMA MONOGRAPH VOL. IV</span>
            <span>UNCOMPROMISED DISCIPLINE</span>
          </div>
        </div>

        {/* Right Column: Scrolling Narrative Track (48% width) */}
        <div className="w-[48%] px-10 xl:px-16 py-20 flex flex-col">
          {CHAPTERS.map((chap, idx) => (
            <div
              key={chap.id}
              className={`editorial-chapter min-h-[90vh] flex flex-col justify-center relative ${
                idx !== CHAPTERS.length - 1 ? 'mb-32' : 'mb-16'
              }`}
            >
              {/* Aggressive Overlapping Chapter Outline Index */}
              <div className="font-display font-black text-[7rem] xl:text-[9rem] leading-none text-outline-brown opacity-25 select-none -mb-10 -ml-4 pointer-events-none">
                {chap.index}
              </div>

              {/* Tag & Subtitle */}
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-accent mb-3 font-semibold">
                <chap.icon size={16} />
                <span>{chap.tag}</span>
              </div>

              {/* Headline */}
              <h3 className="font-display text-4xl xl:text-5xl font-bold text-brown-900 leading-tight mb-6">
                {chap.title}
              </h3>

              {/* Editorial Quote */}
              <blockquote className="font-display italic text-xl xl:text-2xl text-accent-dark font-medium leading-snug mb-8 border-l-2 border-accent pl-6 py-1">
                &ldquo;{chap.quote}&rdquo;
              </blockquote>

              {/* Story Narrative with Drop Cap */}
              <div className="space-y-4 font-body text-brown-700 leading-relaxed text-base xl:text-lg">
                <p>
                  <span className="float-left font-display text-5xl leading-none font-bold text-brown-900 pr-3 pt-1">
                    {chap.dropCap}
                  </span>
                  {chap.story}
                </p>
                <p>{chap.storyCont}</p>
              </div>

              {/* Explore Link */}
              <div className="mt-8 pt-6 border-t border-brown-200 flex items-center justify-between">
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] font-semibold text-accent hover:text-accent-dark transition-colors group"
                >
                  <span>EXPLORE TASTING NOTES</span>
                  <ArrowUpRight
                    size={16}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
                <span className="font-mono text-xs text-brown-400">
                  {idx + 1} / 3
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE / TABLET STACKED MAGAZINE VIEW (< 1024px) */}
      <div className="lg:hidden px-6 sm:px-10 py-20 space-y-24">
        {/* Header Intro */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold block mb-2">
            03 / EDITORIAL ARCHIVE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-brown-900 font-bold">
            The Philosophy in Three Chapters
          </h2>
        </div>

        {CHAPTERS.map((chap) => (
          <article
            key={chap.id}
            className="rounded-3xl bg-cream-dark/60 border border-brown-200/60 p-6 sm:p-8 overflow-hidden shadow-sm"
          >
            {/* Outline Index */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-5xl font-black text-outline-brown opacity-40">
                {chap.index}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
                {chap.tag}
              </span>
            </div>

            {/* Photo */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md mb-6 relative">
              <img
                src={chap.image}
                alt={chap.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 via-transparent to-transparent" />
            </div>

            {/* Title */}
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-brown-900 mb-4">
              {chap.title}
            </h3>

            {/* Quote */}
            <blockquote className="font-display italic text-lg text-accent-dark font-medium leading-snug mb-6 border-l-2 border-accent pl-4">
              &ldquo;{chap.quote}&rdquo;
            </blockquote>

            {/* Story */}
            <p className="font-body text-brown-700 text-sm sm:text-base leading-relaxed mb-6">
              {chap.dropCap + chap.story}
            </p>

            {/* Mobile Specs */}
            <div className="grid grid-cols-2 gap-2 p-4 rounded-xl bg-brown-900 text-cream font-mono text-[11px] mb-6">
              {chap.specs.map((spec, sIdx) => (
                <div key={sIdx}>
                  <span className="text-[10px] text-accent block uppercase">
                    {spec.label}
                  </span>
                  <span className="text-cream/90">{spec.value}</span>
                </div>
              ))}
            </div>

            <a
              href="#menu"
              className="inline-flex items-center gap-2 text-accent font-semibold text-xs font-mono uppercase tracking-widest hover:text-accent-dark"
            >
              <span>EXPERIENCE THE CRAFT</span>
              <ArrowUpRight size={14} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
