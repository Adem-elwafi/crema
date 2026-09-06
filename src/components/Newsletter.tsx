import { useState, useRef, type FormEvent } from 'react';
import { Mail, Check, Sparkles, Instagram, Facebook, Twitter, Youtube, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useScrollReveal(sectionRef, { y: 30, opacity: 0 });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
  };

  return (
    <section
      ref={sectionRef}
      id="newsletter"
      className="relative py-24 sm:py-32 bg-[#1A100B] text-cream px-6 sm:px-10 lg:px-16 overflow-hidden border-t border-[#C8956C]/15"
    >
      {/* Ambient glow backgrounds */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#A0714D]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Fellowship Invitation & Member Perks */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4">
              <Sparkles size={14} />
              <span>04 / PRIVATE ROASTERY DISPATCH</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-cream font-bold tracking-tight mb-6 leading-tight">
              The Crema Fellowship
            </h2>

            <p className="font-display italic text-xl sm:text-2xl text-[#E8C9A0]/90 mb-8 max-w-xl leading-relaxed">
              &ldquo;An unhurried dispatch on rare micro-lot harvests, seasonal roast profiles, and sensory cupping notes.&rdquo;
            </p>

            {/* Member Privileges List */}
            <div className="space-y-4 pt-4 border-t border-white/10 max-w-lg">
              <div className="flex items-start gap-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                <p className="font-body text-cream/80 text-sm sm:text-base">
                  <strong className="text-cream font-medium">First-Access Allocations:</strong> Reserve limited anaerobic micro-lots 48 hours prior to public roastery release.
                </p>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                <p className="font-body text-cream/80 text-sm sm:text-base">
                  <strong className="text-cream font-medium">Private Cupping Rituals:</strong> Invitations to after-hours sensory tastings and barista masterclasses.
                </p>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                <p className="font-body text-cream/80 text-sm sm:text-base">
                  <strong className="text-cream font-medium">Seasonal Monograph:</strong> Quarterly printed brew almanacs detailing origin terroir and water chemistry.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Luxury Enrollment Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#251711]/70 border border-[#C8956C]/25 p-8 sm:p-10 backdrop-blur-md shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 font-mono text-xs text-accent uppercase tracking-widest">
                <span>MEMBERSHIP DISPATCH</span>
                <span>NO. 2026</span>
              </div>

              {isSubscribed ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-accent/20 text-accent border border-accent/40 flex items-center justify-center mx-auto">
                    <Check size={28} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-cream">
                    Welcome to the Fellowship
                  </h3>
                  <p className="font-body text-sm text-cream/70 leading-relaxed">
                    Your enrollment is verified. The next harvest dispatch will arrive directly in your private inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="fellowship-email"
                      className="block font-mono text-xs uppercase tracking-[0.2em] text-cream/70 mb-2"
                    >
                      Electronic Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-accent">
                        <Mail size={18} />
                      </div>
                      <input
                        id="fellowship-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="curator@domain.com"
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-[#C8956C]/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-body text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="cursor-pointer w-full py-4 px-6 rounded-xl bg-accent text-brown-900 font-mono text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#E8C9A0] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:scale-[1.02]"
                  >
                    <span>JOIN THE FELLOWSHIP</span>
                    <ArrowRight size={16} />
                  </button>

                  <p className="font-mono text-[10px] text-cream/50 uppercase tracking-widest text-center pt-2">
                    UNCOMPROMISED PRIVACY · NO NOISE · ZERO SPAM
                  </p>
                </form>
              )}

              {/* Social Channels Monograph */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-xs text-cream/60 uppercase tracking-wider">
                  Social Archive
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cream/70 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram size={15} />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cream/70 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all"
                    aria-label="Facebook"
                  >
                    <Facebook size={15} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cream/70 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all"
                    aria-label="Twitter"
                  >
                    <Twitter size={15} />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cream/70 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all"
                    aria-label="YouTube"
                  >
                    <Youtube size={15} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
