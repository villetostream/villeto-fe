import Marquee from "@/components/landing/Marquee";

const companies = [
  {
    id: "logo-1",
    name: "Anduril",
    year: "2024",
    svg: (
      <img
        src="/images/marquee-svgs/anduril.svg"
        alt="Anduril"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-2",
    name: "Barry's",
    year: "2023",
    svg: (
      <img
        src="/images/marquee-svgs/barrys.svg"
        alt="Barry's"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-3",
    name: "Discord",
    year: "2023",
    svg: (
      <img
        src="/images/marquee-svgs/discord.svg"
        alt="Discord"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-4",
    name: "CBRE",
    year: "2023",
    svg: (
      <img
        src="/images/marquee-svgs/cbre.svg"
        alt="CBRE"
        className="w-20 h-8"
      />
    ),
  },
  // {
  //   id: "logo-5",
  //   name: "Eventbrite",
  //   year: "2024",
  //   svg: (
  //     <img
  //       src="/images/marquee-svgs/eventbrite.svg"
  //       alt="Eventbrite"
  //       className="w-20 h-8"
  //     />
  //   ),
  // },
  {
    id: "logo-6",
    name: "GDRX",
    year: "2024",
    svg: (
      <img
        src="/images/marquee-svgs/gdrx.svg"
        alt="GDRX"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-7",
    name: "Kumon",
    year: "2024",
    svg: (
      <img
        src="/images/marquee-svgs/kumon.svg"
        alt="Kumon"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-8",
    name: "Microsoft",
    year: "2024",
    svg: (
      <img
        src="/images/marquee-svgs/microsoft.svg"
        alt="Microsoft"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-9",
    name: "Virgin Voyages",
    year: "2024",
    svg: (
      <img
        src="/images/marquee-svgs/virgin-voyages.svg"
        alt="Virgin Voyages"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-10",
    name: "Notion",
    year: "2023",
    svg: (
      <img
        src="/images/marquee-svgs/notion.svg"
        alt="Notion"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-11",
    name: "Quora",
    year: "2023",
    svg: (
      <img
        src="/images/marquee-svgs/quora.svg"
        alt="Quora"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-12",
    name: "Sierra Nevada",
    year: "2023",
    svg: (
      <img
        src="/images/marquee-svgs/sierra-nevada.svg"
        alt="Sierra Nevada"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-13",
    name: "Shopify",
    year: "2024",
    svg: (
      <img
        src="/images/marquee-svgs/shopify.svg"
        alt="Shopify"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-14",
    name: "Stripe",
    year: "2024",
    svg: (
      <img
        src="/images/marquee-svgs/stripe.svg"
        alt="Stripe"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-15",
    name: "Valcourt",
    year: "2024",
    svg: (
      <img
        src="/images/marquee-svgs/valcourt.svg"
        alt="Valcourt"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-16",
    name: "Webflow",
    year: "2024",
    svg: (
      <img
        src="/images/marquee-svgs/webflow.svg"
        alt="Webflow"
        className="w-20 h-8"
      />
    ),
  },
  {
    id: "logo-17",
    name: "Zola",
    year: "2024",
    svg: (
      <img
        src="/images/marquee-svgs/zola.svg"
        alt="Zola"
        className="w-20 h-8"
      />
    ),
  },
];

export default function TrustedCompanies() {
  return (
    <section className="max-w-[1560px] py-12">
      <div className="container">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2.5 h-2.5 rounded-full border border-[#cdcdcd]" />
          <div className="w-5 h-0 border-t border-[#cdcdcd]" />
          <span className="px-5 py-3 bg-[#eaeaea]/30 rounded-[50px] border border-[#eaeaea]/60 text-sm font-medium text-[#0d0d0d] font-['Figtree']">
            COMPANIES
          </span>
          <div className="w-5 h-0 border-t border-[#cdcdcd]" />
          <div className="w-2.5 h-2.5 rounded-full border border-[#cdcdcd]" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Trusted by these brands and more
          </p>
        </div>
        <div className="overflow-hidden rounded-lg bg-white">
          <Marquee items={companies} speed={40} gap={28} />
        </div>
      </div>
    </section>
  );
}
