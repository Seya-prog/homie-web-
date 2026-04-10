const navItems = [
  {
    icon: "explore",
    title: "Browse",
    description: "Explore 2,400+ curated properties.",
  },
  {
    icon: "dashboard",
    title: "Dashboard",
    description: "Manage your applications and tours.",
  },
  {
    icon: "payments",
    title: "Payments",
    description: "Secure rent and deposit handling.",
  },
  {
    icon: "verified_user",
    title: "Trusted",
    description: "Verified owners and secure leases.",
  },
];

export default function QuickNav() {
  return (
    <section className="py-12 bg-surface">
      <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {navItems.map((item) => (
          <div
            key={item.title}
            className="p-6 rounded-2xl bg-surface-container-low flex flex-col items-start gap-2 hover:bg-surface-container-high transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <h3 className="font-bold text-primary">{item.title}</h3>
            <p className="text-sm text-on-surface-variant">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
