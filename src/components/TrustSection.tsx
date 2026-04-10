const features = [
  {
    icon: "verified",
    title: "Premium Verification",
    description:
      "We verify every owner and property listing to ensure you're only seeing legitimate, high-quality opportunities.",
    bgColor: "bg-primary-fixed",
    iconColor: "text-primary",
  },
  {
    icon: "contract",
    title: "Seamless Leases",
    description:
      "Digitally sign your lease and handle security deposits within our protected environment.",
    bgColor: "bg-secondary-fixed",
    iconColor: "text-secondary",
  },
  {
    icon: "support_agent",
    title: "24/7 Concierge Support",
    description:
      "Dedicated support for maintenance and financial inquiries, ensuring peace of mind throughout your stay.",
    bgColor: "bg-tertiary-fixed",
    iconColor: "text-tertiary",
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image Side */}
        <div className="relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover"
              alt="minimalist interior of a modern living room"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmUXje_JcQep5-_7xWMu8G2tFSRtli5rHEK7E4HhvPhnZ4SJ8kd46awx0LwcKlyeGtYcBA-s_2KseAJE8VjKtTZscBMejZ09qSqPJKfUvDICJncOn7fP50cCq47SNL89UYfTI3V_RZqOTdzYuccmPL-bo0G0hh-1yo8WBjXlKaCS9MZbzNaWSESzjckVx9UVxtkhwVM1UfZ0jZwLBhzg8SmpEzbH0L_zCC8n0PBQLvGVTjxqkBm-yMMMcB-w15YdPZ-9mwmiTr0fKv"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 bg-tertiary text-on-tertiary p-8 rounded-3xl shadow-xl max-w-xs">
            <p className="text-4xl font-black mb-2 font-headline">98%</p>
            <p className="text-sm font-medium opacity-80">
              Of our seekers find their perfect match within the first 14 days of
              browsing.
            </p>
          </div>
        </div>

        {/* Content Side */}
        <div>
          <h2 className="text-4xl font-bold text-primary mb-8 tracking-tight font-headline">
            The Modern Standard for Management.
          </h2>
          <div className="space-y-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-6">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center shrink-0`}
                >
                  <span
                    className={`material-symbols-outlined ${feature.iconColor}`}
                  >
                    {feature.icon}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-on-surface-variant">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
