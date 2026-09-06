import { Compass, Clock, VolumeX, ArrowUpRight, Sparkles } from 'lucide-react';
import qualityCoffeeImg from '../assets/images/features/quality-coffee.jpg';
import freshDeliciousImg from '../assets/images/features/fresh-delicious.jpg';
import cozyAtmosphereImg from '../assets/images/features/cozy-atmosphere.jpg';

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
  return (
    <section
      id="why-us"
      className="relative w-full bg-[#FDF8F3] text-brown-900 py-24 sm:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden"
    >
      {/* Anchor shim for legacy #about links */}
      <span id="about" className="absolute top-0 pointer-events-none" />

      {/* Atmospheric background accents */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-brown-900/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 sm:mb-28">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">
            <Sparkles size={14} />
            <span>03 / THE EDITORIAL MONOGRAPH</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-brown-900 font-bold tracking-tight mb-6">
            The Philosophy in Three Chapters
          </h2>
          <p className="font-body text-brown-500 text-base sm:text-lg leading-relaxed">
            Three foundational disciplines that define our standard of craftsmanship: sacred sourcing, nocturnal baking, and meditative spatial acoustics.
          </p>
        </div>

        {/* 3 Alternating Editorial Rows */}
        <div className="space-y-28 sm:space-y-36">
          {CHAPTERS.map((chap, idx) => {
            const isEven = idx % 2 === 1; // Row 2 has text on left, photo on right on desktop

            return (
              <div
                key={chap.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
              >
                {/* Photo Column */}
                <div
                  className={`lg:col-span-6 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-brown-900/10 bg-[#1C100B]">
                    <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden">
                      <img
                        src={chap.image}
                        alt={chap.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-transparent to-black/10" />

                      {/* Floating chapter tag badge */}
                      <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest text-brown-900 shadow-md uppercase">
                        {chap.tag}
                      </div>

                      {/* Technical Spec Sheet Overlay */}
                      <div className="absolute bottom-5 inset-x-5 grid grid-cols-2 gap-2.5 sm:gap-3 p-4 rounded-2xl bg-[#1C100B]/90 backdrop-blur-md border border-[#C8956C]/20 text-cream">
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
                  </div>
                </div>

                {/* Narrative Text Column */}
                <div
                  className={`lg:col-span-6 flex flex-col justify-center ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  {/* Oversized Outline Numeral */}
                  <div className="font-display font-black text-6xl sm:text-8xl lg:text-9xl leading-none text-outline-brown opacity-20 select-none -mb-6 sm:-mb-10 -ml-2 pointer-events-none">
                    {chap.index}
                  </div>

                  {/* Tag & Subtitle */}
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-accent mb-3 font-semibold">
                    <chap.icon size={16} />
                    <span>CHAPTER {chap.index} · {chap.tag}</span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-900 leading-tight mb-5">
                    {chap.title}
                  </h3>

                  {/* Editorial Quote */}
                  <blockquote className="font-display italic text-lg sm:text-xl text-accent-dark font-medium leading-snug mb-6 border-l-2 border-accent pl-5 py-0.5">
                    &ldquo;{chap.quote}&rdquo;
                  </blockquote>

                  {/* Story Narrative with Drop Cap */}
                  <div className="space-y-4 font-body text-brown-700 leading-relaxed text-sm sm:text-base">
                    <p>
                      <span className="float-left font-display text-4xl sm:text-5xl leading-none font-bold text-brown-900 pr-3 pt-1">
                        {chap.dropCap}
                      </span>
                      {chap.story}
                    </p>
                    <p>{chap.storyCont}</p>
                  </div>

                  {/* Explore Link & Monograph Index */}
                  <div className="mt-8 pt-6 border-t border-brown-200/70 flex items-center justify-between">
                    <a
                      href="#menu"
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] font-semibold text-accent hover:text-accent-dark transition-colors group"
                    >
                      <span>EXPLORE EXTRACTIONS</span>
                      <ArrowUpRight
                        size={16}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </a>
                    <span className="font-mono text-xs text-brown-400">
                      VOLUME IV · {idx + 1} OF 3
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
