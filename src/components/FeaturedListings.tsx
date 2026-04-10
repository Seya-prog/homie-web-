import Link from "next/link";

const properties = [
  {
    id: 1,
    name: "The Glass House",
    location: "Malibu Heights, CA",
    price: "$12,500/mo",
    beds: "4 Beds",
    baths: "3.5 Baths",
    sqft: "3,200 sqft",
    badge: "NEW LISTING",
    favorited: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC61TQxE3jthnv2fQCVm8m2ZFRDjJkVnB7ssu3ed4_rVVvCseNw3xETyGBuk9VgQHl793jTA81ZqfKivPX5rmchqK7bxodhdF4xWQgRUhQfNfVqtbZpzSgNwaBGwm8WmnG6AwDqmmcNdnWzPzvsHX0fS2DWSqe4XxP3n9mg4AhljV3Q6VQPKgXqv4SGnEVfk9nIVrR7nrhtUy3ytyOYBiV4eulkyREC9HnU-5ynlZYv6KKTBOq6Q38TKNUm_vNDmAnsM4Yspyq-_KcM",
  },
  {
    id: 2,
    name: "Skyline Penthouse",
    location: "Downtown Metropolis",
    price: "$4,200,000",
    beds: "3 Beds",
    baths: "3 Baths",
    sqft: "2,150 sqft",
    badge: null,
    favorited: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDem4719k7uCGAXFt8QadnaxJ-bE5xyUzshDL99W-KEkwGf9gC9fXQfn4f7Yp8V6i0fQz9TboDAiXpuFe9SQ9-KyrymqZPsOKg9U2yjvslROIhA8BokNdWPo4dyiLOnlxihC77R-xy-Wwe1VKCPoHjh1Gtxcb63u_VWP0J-DscZlob338fKieY7urMdDCK3vAOCV6EeZaZ3au6H70xUaJZjH0XpDUjjl3jBAghFzK74KVKSLysziYRAWmaSuKt-M3vBp2Vr4JzKf0zU",
  },
  {
    id: 3,
    name: "Oakwood Manor",
    location: "Greenwich Village, CT",
    price: "$5,800/mo",
    beds: "5 Beds",
    baths: "4.5 Baths",
    sqft: "4,100 sqft",
    badge: null,
    favorited: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIqANMXctQDZEIh16t6X8nbemjQYKyIPbk1w1gcEOtYUPxMzjt0GH3P0aSmQ1HA_Ux31HbsOA-zvDD8iHW9o4jhbOvB8SiWZySRJyx5pFCRsJrUZEloVviZKst6SNIfy3qbl6exN2HI8Op9u8Qshw9poGYiG1Z1tb3LXHOQeCrgKmiBLFEH9-I3f_vegQw3he__DaVSYTMsO5Cy2AbITWirbjhDmmsBOD1XZNbifyXtWqVqJRJfW48loHgJeYzf5c_IATHb3sPu7qh",
  },
];

export default function FeaturedListings() {
  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold text-primary mb-4 tracking-tight font-headline">
              Featured Listings
            </h2>
            <p className="text-on-surface-variant font-medium">
              Hand-picked properties selected for their exceptional design and
              prime locations across the coast.
            </p>
          </div>
          <Link href="/listings" className="group flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
            View All
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Link
              href={`/properties/${property.id}`}
              key={property.name}
              className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 no-underline text-inherit"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={property.name}
                  src={property.image}
                />
                {property.badge && (
                  <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
                    {property.badge}
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-primary text-on-primary px-4 py-2 rounded-lg font-bold shadow-lg">
                  {property.price}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-primary font-headline">
                    {property.name}
                  </h3>
                  <span
                    className={`material-symbols-outlined cursor-pointer ${
                      property.favorited ? "text-secondary" : "text-outline"
                    }`}
                    style={
                      property.favorited
                        ? { fontVariationSettings: "'FILL' 1" }
                        : undefined
                    }
                  >
                    favorite
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm !text-[14px]">
                    location_on
                  </span>
                  {property.location}
                </p>
                <div className="flex items-center gap-6 border-t border-surface-container-high pt-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline">
                      bed
                    </span>
                    <span className="text-sm font-bold">{property.beds}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline">
                      bathtub
                    </span>
                    <span className="text-sm font-bold">{property.baths}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline">
                      square_foot
                    </span>
                    <span className="text-sm font-bold">{property.sqft}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
