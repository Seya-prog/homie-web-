export default function Newsletter() {
  return (
    <section className="py-16 px-8 max-w-[1440px] mx-auto">
      <div className="bg-primary p-12 rounded-[2rem] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover"
            alt="abstract architectural patterns"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZLPvK1gfGxBDesmy23rI_bZSgsXYB7bQtIYqXc3V5-RB_EhwNZWPBufTp24pBC8ySfLqxrZXjxnG0LAM4oFrAQ34TrndMaZpuwk3mwxf02gUzKdZWZ-74XjZCes-uEt1XUrowkTDe3BBuE7tp6OCIuez2HEE5MJRI3kL-0Fhx0Hcv5lOEi0Lq6Yjh7H-K4S18j11PuANnownrovYAULwFGCr0UGfqADjDHZkfXnibL-dHGPdlEv-FRe64m7vQObM3Q-aGWd3a10FJ"
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold text-on-primary mb-6 font-headline">
            Stay ahead of the market.
          </h2>
          <p className="text-on-primary-container text-lg mb-8 font-medium">
            Get early access to premium listings and market reports delivered
            directly to your inbox weekly.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              className="flex-1 bg-surface-container-lowest/10 border border-on-primary-container/30 rounded-xl px-6 py-4 text-on-primary placeholder:text-on-primary-container focus:ring-secondary-container focus:border-secondary-container outline-none transition-all"
              placeholder="Enter your email"
              type="email"
            />
            <button
              type="submit"
              className="bg-secondary-container text-on-secondary-container font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-lg"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
