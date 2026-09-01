interface MasterNavOverlayProps {
  navLinks: { label: string; href: string }[];
  onHoverNavIndex: (index: number | null) => void;
  onHoverButton: (button: string | null) => void;
  onCartClick: () => void;
  onOrderClick: () => void;
  onOpenDrawer: () => void;
}

export const MasterNavOverlay = ({
  navLinks,
  onHoverNavIndex,
  onHoverButton,
  onCartClick,
  onOrderClick,
  onOpenDrawer,
}: MasterNavOverlayProps) => {
  return (
    <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between relative pointer-events-auto select-none">
      {/* LEFT: Logo Hit Target */}
      <a
        href="#hero"
        aria-label="CREMA - Return to top"
        className="w-[140px] h-10 opacity-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
      />

      {/* CENTER: Navigation Link Hit Targets (Unified hit testing across diagonal split) */}
      <nav className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
        {navLinks.map((link, idx) => (
          <a
            key={link.label}
            href={link.href}
            onMouseEnter={() => onHoverNavIndex(idx)}
            onMouseLeave={() => onHoverNavIndex(null)}
            className="py-2 px-2 text-xs uppercase tracking-[0.22em] font-semibold opacity-0 cursor-pointer select-none"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* RIGHT: Action Hit Targets */}
      <div className="flex items-center z-20">
        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onCartClick}
            onMouseEnter={() => onHoverButton('cart')}
            onMouseLeave={() => onHoverButton(null)}
            aria-label="View Cart"
            className="w-10 h-10 rounded-full opacity-0 cursor-pointer"
          />

          <button
            onClick={onOrderClick}
            onMouseEnter={() => onHoverButton('order')}
            onMouseLeave={() => onHoverButton(null)}
            className="px-6 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase font-bold opacity-0 cursor-pointer"
          >
            Order Online
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="md:hidden flex items-center gap-2.5">
          <button
            onClick={onCartClick}
            aria-label="View Cart"
            className="w-9 h-9 rounded-full opacity-0 cursor-pointer"
          />
          <button
            onClick={onOpenDrawer}
            aria-label="Open mobile navigation"
            className="w-9 h-9 rounded-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
