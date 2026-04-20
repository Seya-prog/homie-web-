import Link from "next/link";

export default function MobileNav() {
  const items = [
    { icon: "explore", label: "Browse", href: "/listings", active: true },
    { icon: "map", label: "Map", href: "/map-search", active: false },
    { icon: "dashboard", label: "Dashboard", href: "/dashboard", active: false },
    { icon: "person", label: "Account", href: "/login", active: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest/80 backdrop-blur-xl border-t border-surface-container-high py-3 px-6 flex justify-between items-center z-50">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            item.active ? "text-primary" : "text-on-surface-variant"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={
              item.active
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            {item.icon}
          </span>
          <span className="text-[10px] font-bold">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
