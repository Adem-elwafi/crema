const products = [
  {
    name: 'Éthiopie Sidamo',
    origin: 'Sidamo, Ethiopia',
    roast: 'Light roast',
    notes: 'Jasmine, bergamot, stone fruit',
    description:
      'A lifted single-origin cup with a silken body and a luminous finish that stays bright without losing depth.',
  },
  {
    name: 'Dark Roast Blend',
    origin: 'House blend',
    roast: 'Dark roast',
    notes: 'Cocoa nib, toasted walnut, smoked caramel',
    description:
      'Built for long, slow mornings: bold enough to linger, refined enough to stay clean on the palate.',
  },
  {
    name: 'Guatemala Volcán',
    origin: 'Antigua, Guatemala',
    roast: 'Medium roast',
    notes: 'Pecan, brown sugar, orange peel',
    description:
      'Volcanic soils deliver structure and sweetness in a balanced profile with a warm, rounded finish.',
  },
  {
    name: 'Kenya Rift Reserve',
    origin: 'Nyeri, Kenya',
    roast: 'Medium-light roast',
    notes: 'Blackcurrant, hibiscus, raw honey',
    description:
      'High-toned acidity and a transparent cup profile designed for clarity, elegance, and a crisp aftertaste.',
  },
]

const ProductGrid = () => {
  return (
    <section
      id="collections"
      className="scroll-mt-24 border-y border-white/5 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.08),transparent_50%),linear-gradient(180deg,#12100d_0%,#0f0d0b_100%)] px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
            The Collections
          </p>
          <h2 className="text-3xl font-light tracking-tight text-white md:text-5xl">
            A restrained selection of coffees, chosen for clarity, depth, and a clean aromatic finish.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.name}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-white/[0.05]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-amber-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col">
                <div className="mb-10 flex items-start justify-between gap-4">
                  <span className="text-xs font-medium uppercase tracking-[0.24em] text-neutral-500">
                    {product.roast}
                  </span>
                  <span className="text-xs uppercase tracking-[0.24em] text-amber-600/80">
                    {product.origin}
                  </span>
                </div>

                <div className="mb-8 space-y-4">
                  <h3 className="text-2xl font-light tracking-tight text-white transition-colors duration-300 group-hover:text-amber-50">
                    {product.name}
                  </h3>
                  <p className="text-sm uppercase tracking-[0.18em] text-neutral-400">
                    {product.notes}
                  </p>
                  <p className="max-w-sm text-sm leading-7 text-neutral-300">
                    {product.description}
                  </p>
                </div>

                <div className="mt-auto border-t border-white/8 pt-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-neutral-500">
                    <span>Hand-roasted</span>
                    <span className="text-amber-600 transition-transform duration-300 group-hover:translate-x-1">
                      View profile
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid
