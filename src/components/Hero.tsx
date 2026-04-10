export default function Hero() {
  return (
    <section className="relative min-h-[716px] flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover"
          alt="luxury modern architectural villa with large glass windows at dusk"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjJ7HrSAfOKCEeQ8GBcNumNvgEvvgY8oH85aPvUnMu5FqSs9vTKbP_lqSAAxoefJRsNKl_2x6EhwO0qZU3_Io3vFkM9jwqpngBWeWjHYGKV3AA17iRU0hiulhab28Ywi4PB71H8iOsFhqFZLV8tMKqwrNh5ThuR4bNGrGDPP-SoDO3gJOAR7Qx5w0vRFpDmrfaHorrEwq_86UXnVdRrCh4Psxs6Rr54RMm4d7nW9L0vg3msAnFW-E085gLQyzObSKsnQedeztgAaZo"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-surface" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary mb-6 drop-shadow-sm font-headline">
          Find your next home with ease.
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-medium leading-relaxed">
          Access exclusive listings and manage your entire rental journey through
          our curated digital concierge platform.
        </p>
      </div>

      {/* Search Bento Box */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="bg-surface-container-lowest/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch gap-2 border border-outline-variant/30">
          {/* Location */}
          <div className="flex-1 flex items-center px-6 py-4 bg-surface-container-high/50 rounded-xl">
            <span className="material-symbols-outlined text-outline mr-3">
              location_on
            </span>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest font-bold text-outline">
                Location
              </label>
              <input
                className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-on-surface font-semibold placeholder:text-outline/60 text-lg w-full"
                placeholder="Where do you want to live?"
                type="text"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="flex-1 flex items-center px-6 py-4 bg-surface-container-high/50 rounded-xl">
            <span className="material-symbols-outlined text-outline mr-3">
              payments
            </span>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest font-bold text-outline">
                Price Range
              </label>
              <select className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-on-surface font-semibold text-lg cursor-pointer appearance-none">
                <option>$2,000 - $4,000</option>
                <option>$4,000 - $8,000</option>
                <option>$8,000+</option>
              </select>
            </div>
          </div>

          {/* Type */}
          <div className="flex-1 flex items-center px-6 py-4 bg-surface-container-high/50 rounded-xl">
            <span className="material-symbols-outlined text-outline mr-3">
              home_work
            </span>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest font-bold text-outline">
                Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    defaultChecked
                    className="text-primary focus:ring-primary border-outline-variant accent-primary"
                    name="ptype"
                    type="radio"
                  />
                  <span className="font-semibold text-on-surface">Rent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    className="text-primary focus:ring-primary border-outline-variant accent-primary"
                    name="ptype"
                    type="radio"
                  />
                  <span className="font-semibold text-on-surface">Buy</span>
                </label>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button className="bg-secondary-container text-on-secondary-container px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-lg active:scale-95">
            <span className="material-symbols-outlined">search</span>
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
