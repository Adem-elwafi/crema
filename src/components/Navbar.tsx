import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'Menu', 'About', 'Gallery', 'Contact'];

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Main nav */}
      <nav className="w-full px-6 py-6 bg-transparent transition-all duration-300">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo is on the dark brown left side at the top, but over light background when scrolled */}
          <div className="font-display font-bold text-2xl tracking-wider text-accent transition-colors duration-300">
            CREMA
          </div>

          {/* Links are overlapping both cream and brown sections depending on screen size */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="font-body text-sm uppercase tracking-wider text-accent hover:text-cream transition-colors duration-300 font-medium"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <button className="border border-accent text-accent rounded-full px-6 py-2 font-semibold hover:bg-accent hover:text-cream transition-all duration-500 font-body text-sm tracking-widest uppercase shadow-sm">
              Order Online
            </button>
          </div>

          {/* Mobile menu icon */}
          <button
            className="md:hidden text-accent transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`absolute top-full left-0 w-full bg-cream-dark shadow-lg transition-all duration-300 md:hidden overflow-hidden ${
          mobileMenuOpen ? 'max-h-[400px] py-4' : 'max-h-0 py-0'
        }`}
      >
        <div className="flex flex-col items-center gap-4 px-6">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="font-body text-sm uppercase tracking-wider text-brown-900 font-medium block w-full text-center py-2 border-b border-brown-200/50 last:border-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <button className="border border-[#C8956C]/50 text-[#C8956C] rounded-full px-6 py-2 font-semibold w-full mt-4 hover:bg-[#C8956C] hover:text-cream transition-colors duration-500 tracking-widest uppercase">
            Order Online
          </button>
        </div>
      </div>
    </header>
  );
}
