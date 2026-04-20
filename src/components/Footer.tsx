import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          {/* Brand */}
          <div className="col-span-1">
            <span className="text-3xl font-black tracking-tighter text-primary-container mb-6 block">
              Homie
            </span>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Redefining the estate management experience for the modern
              generation of seekers and owners.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all cursor-pointer">
                <span className="material-symbols-outlined !text-[18px]">
                  public
                </span>
              </div>
              <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all cursor-pointer">
                <span className="material-symbols-outlined !text-[18px]">
                  mail
                </span>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h5 className="font-bold text-primary mb-6">Explore</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant font-medium">
              <li className="hover:text-primary cursor-pointer transition-colors">
                <Link href="/listings">Buy a Home</Link>
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                <Link href="/listings">Rent a Home</Link>
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                <Link href="/map-search">Map Search</Link>
              </li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h5 className="font-bold text-primary mb-6">For Owners</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant font-medium">
              <li className="hover:text-primary cursor-pointer transition-colors">
                <Link href="/signup">Sell a Property</Link>
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                <Link href="/properties/new">List a Property</Link>
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                <Link href="/dashboard">Owner Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h5 className="font-bold text-primary mb-6">Account</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant font-medium">
              <li className="hover:text-primary cursor-pointer transition-colors">
                <Link href="/login">Log In</Link>
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                <Link href="/signup">Sign Up</Link>
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-container-high flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-outline">
          <p>© 2025 HOMIE ESTATE MANAGEMENT. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span>STATUS: ALL SYSTEMS OPERATIONAL</span>
            <span>BUILT WITH PRECISION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
