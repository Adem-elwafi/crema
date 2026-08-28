import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brown-900 text-cream pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          
          <div className="col-span-1">
            <h3 className="font-display font-bold text-3xl mb-4 tracking-wider">CREMA</h3>
            <p className="text-cream/70 font-body mb-6 max-w-xs">
              Premium coffee, crafted with love. A place where every cup tells a story.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-cream/80 hover:text-accent transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-cream/80 hover:text-accent transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-cream/80 hover:text-accent transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-display font-semibold text-xl mb-4">Quick Links</h4>
            <ul className="space-y-3 font-body text-cream/70">
              <li><a href="#" className="hover:text-accent transition-colors">Home</a></li>
              <li><a href="#menu" className="hover:text-accent transition-colors">Menu</a></li>
              <li><a href="#about" className="hover:text-accent transition-colors">About</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Gallery</a></li>
              <li><a href="#contact" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-display font-semibold text-xl mb-4">Contact</h4>
            <ul className="space-y-3 font-body text-cream/70">
              <li>123 Coffee Street</li>
              <li>Beanville, CB 12345</li>
              <li><a href="tel:5551234567" className="hover:text-accent transition-colors">(555) 123-4567</a></li>
              <li><a href="mailto:hello@crema.com" className="hover:text-accent transition-colors">hello@crema.com</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-display font-semibold text-xl mb-4">Hours</h4>
            <ul className="space-y-3 font-body text-cream/70">
              <li>Monday-Friday:<br/> <span className="text-cream">7AM - 9PM</span></li>
              <li>Saturday:<br/> <span className="text-cream">8AM - 10PM</span></li>
              <li>Sunday:<br/> <span className="text-cream">9AM - 8PM</span></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-brown-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-cream/50 text-sm font-body">
          <p>© {new Date().getFullYear()} CREMA. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cream transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cream transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
