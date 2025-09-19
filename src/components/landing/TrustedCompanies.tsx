import Marquee from "@/components/landing/Marquee"

const companies = [
  { name: "Microsoft", logo: "/images/logos/microsoft-logo.webp" },
  { name: "Google", logo: "/images/logos/google-logo.webp" },
  { name: "Amazon", logo: "/images/;ogos/amazon-logo.webp" },
  { name: "Apple", logo: "/images/logos/apple-logo.webp" },
  { name: "Meta", logo: "/images/logos/meta-logo-abstract.webp" },
  { name: "Netflix", logo: "/images/logos/netflix-inspired-logo.webp" },
  { name: "Spotify", logo: "/images/logos/spotify-logo.webp" },
  { name: "Uber", logo: "/images/logos/uber.webp" },
]

export default function TrustedCompanies() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Trusted by teams everywhere
          </p>
        </div>
        <Marquee pauseOnHover className="[--duration:20s]">
          {companies.map((company, index) => (
            <div key={index} className="flex items-center justify-center px-8">
              <img
                src={company.logo || "/placeholder.svg"}
                alt={`${company.name} logo`}
                className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
