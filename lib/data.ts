import { Trophy, ShieldCheck, Handshake, Zap, HeartHandshake, Gift, Volleyball, Goal, Drumstick, Dumbbell, Shield } from "lucide-react";

export const siteLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/impact", label: "Impact" },
  { href: "/donate", label: "Donate" },
  { href: "/store", label: "Store" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const vision =
  "Our vision is to ensure every young athlete has the chance to grow, compete, and lead regardless of their family's financial situation. By removing the barriers that hold kids back, we help them fully experience the power of sports and strengthen the pipeline of future leaders across the country.";

export const mission =
  "Our mission is to open doors for youth programs through a fundraising experience families and organizations can trust. We combine reliable processes, innovative technology, and a commitment to real value so that every dollar raised directly supports better opportunities for young athletes.";

export const whyItMatters =
  "When clinics and tournaments have the resources to offer high-quality coaching, modern equipment, proper nutrition, and the ability to travel and compete at the highest levels, young athletes thrive and communities benefit. Supporting youth sports today helps shape responsible, motivated, community-minded leaders for tomorrow.";

export const trustBadges = [
  { label: "Secure Giving", icon: ShieldCheck },
  { label: "Transparent Allocation", icon: Handshake },
  { label: "Community Impact", icon: HeartHandshake },
  { label: "Fast Setup for Programs", icon: Zap },
];

export const impactStats = [
  { label: "Average Support per Athlete", value: "$540" },
  { label: "% Funds Going to Programs", value: "91%" },
  { label: "Programs Supported", value: "126" },
  { label: "Communities Reached", value: "42" },
];

export const homeSteps = [
  {
    title: "Donate or Shop Merch",
    description: "Families, alumni, and supporters give directly or buy products that fuel youth opportunities.",
    icon: Gift,
  },
  {
    title: "Funds Reach Programs",
    description: "Proceeds are allocated to verified clinics and tournaments with transparent tracking.",
    icon: Shield,
  },
  {
    title: "Athletes Gain Resources",
    description: "Young athletes access quality coaching, equipment, travel support, and nutrition tools.",
    icon: Trophy,
  },
];

export type Program = {
  slug: string;
  title: string;
  sport: "Basketball" | "Soccer" | "Baseball" | "Football" | "Track";
  summary: string;
  details: string;
  image: string;
  icon: typeof Volleyball;
};

export const programs: Program[] = [
  {
    slug: "basketball-academy-series",
    title: "Basketball Academy Series",
    sport: "Basketball",
    summary: "Skills clinics focused on confidence, game IQ, and team leadership.",
    details:
      "Our basketball track supports seasonal clinics, coach training, and tournament exposure for underserved athletes from middle school through high school.",
    image: "/images/placeholder.svg",
    icon: Volleyball,
  },
  {
    slug: "community-soccer-labs",
    title: "Community Soccer Labs",
    sport: "Soccer",
    summary: "Local training labs delivering technical development and fitness plans.",
    details:
      "Soccer Labs pair licensed coaches with community fields, supporting both travel and recreational pathways with equitable access to quality instruction.",
    image: "/images/placeholder.svg",
    icon: Goal,
  },
  {
    slug: "diamond-development-pathway",
    title: "Diamond Development Pathway",
    sport: "Baseball",
    summary: "Season-long support for batting, fielding, and tournament readiness.",
    details:
      "Baseball programs fund equipment refreshes, field rentals, nutrition planning, and regional tournament fees for youth teams.",
    image: "/images/placeholder.svg",
    icon: Drumstick,
  },
  {
    slug: "youth-gridiron-camps",
    title: "Youth Gridiron Camps",
    sport: "Football",
    summary: "Safe, high-energy camps focused on fundamentals and mentorship.",
    details:
      "Football camps include position coaching, safety-first strength training, and travel funding to showcase events.",
    image: "/images/placeholder.svg",
    icon: Shield,
  },
  {
    slug: "track-speed-clinic-network",
    title: "Track Speed Clinic Network",
    sport: "Track",
    summary: "Performance clinics for sprint, endurance, and relay development.",
    details:
      "Track initiatives provide coaching labs, timing equipment, and regional meet support to help athletes progress with measurable outcomes.",
    image: "/images/placeholder.svg",
    icon: Dumbbell,
  },
];

export type Product = {
  id: string;
  name: string;
  category: "Hoodie" | "T-Shirt" | "Cap" | "Bottle" | "Bag";
  price: number;
  image: string;
  colors: string[];
  sizes: string[];
  description: string;
};

export const products: Product[] = [
  {
    id: "hoodie-navy",
    name: "Team Legacy Hoodie",
    category: "Hoodie",
    price: 58,
    image: "/images/placeholder.svg",
    colors: ["Navy", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    description: "Heavyweight hoodie with embroidered Sports Our Youth crest.",
  },
  {
    id: "shirt-core",
    name: "Core Supporter Tee",
    category: "T-Shirt",
    price: 28,
    image: "/images/placeholder.svg",
    colors: ["White", "Navy", "Green"],
    sizes: ["S", "M", "L", "XL"],
    description: "Soft everyday tee designed for game day and volunteer events.",
  },
  {
    id: "cap-classic",
    name: "Classic Sideline Cap",
    category: "Cap",
    price: 24,
    image: "/images/placeholder.svg",
    colors: ["Navy", "Black"],
    sizes: ["One Size"],
    description: "Structured cap with breathable mesh back and stitched logo.",
  },
  {
    id: "bottle-hydrate",
    name: "Hydrate to Compete Bottle",
    category: "Bottle",
    price: 22,
    image: "/images/placeholder.svg",
    colors: ["Emerald", "Slate"],
    sizes: ["24oz"],
    description: "Insulated bottle built for long practices and tournament days.",
  },
  {
    id: "hoodie-training",
    name: "Training Ground Hoodie",
    category: "Hoodie",
    price: 60,
    image: "/images/placeholder.svg",
    colors: ["Forest", "Charcoal"],
    sizes: ["S", "M", "L", "XL"],
    description: "Athletic fit hoodie featuring moisture-friendly lining.",
  },
  {
    id: "shirt-performance",
    name: "Performance Program Tee",
    category: "T-Shirt",
    price: 30,
    image: "/images/placeholder.svg",
    colors: ["Navy", "Sand"],
    sizes: ["S", "M", "L", "XL"],
    description: "Breathable training tee with reinforced collar seam.",
  },
  {
    id: "cap-youth",
    name: "Youth Leader Cap",
    category: "Cap",
    price: 21,
    image: "/images/placeholder.svg",
    colors: ["Green", "White"],
    sizes: ["One Size"],
    description: "Low-profile cap with adjustable strap and minimal logo mark.",
  },
  {
    id: "bottle-elite",
    name: "Elite Travel Bottle",
    category: "Bottle",
    price: 26,
    image: "/images/placeholder.svg",
    colors: ["Navy", "Ice"],
    sizes: ["32oz"],
    description: "Large insulated bottle for athletes on the move.",
  },
  {
    id: "bag-daypack",
    name: "Game Day Cinch Bag",
    category: "Bag",
    price: 32,
    image: "/images/placeholder.svg",
    colors: ["Navy", "Green"],
    sizes: ["One Size"],
    description: "Cinch daypack with separate pocket for hydration and gear.",
  },
  {
    id: "bag-travel",
    name: "Travel Team Tote",
    category: "Bag",
    price: 38,
    image: "/images/placeholder.svg",
    colors: ["Stone", "Navy"],
    sizes: ["One Size"],
    description: "Structured tote for tournaments, clinics, and team logistics.",
  },
];

export const values = ["Transparency", "Equity", "Community", "Excellence"];

export const testimonials = [
  {
    role: "Coach",
    quote:
      "Sports Our Youth helped us fund tournament travel and coaching stipends in one season. Families felt informed every step of the way.",
    name: "Coach Maria Thompson",
  },
  {
    role: "Parent",
    quote:
      "The process felt secure and easy to trust. We could see how funds were used and what opportunities were unlocked.",
    name: "James Carter",
  },
  {
    role: "Athlete",
    quote:
      "I got better equipment and was able to attend an elite clinic. It changed how I train and what I believe is possible.",
    name: "Ari Johnson",
  },
];

export const faqItems = [
  {
    question: "How are donated funds used?",
    answer:
      "Funds primarily support coaching access, equipment purchases, nutrition support, tournament travel, and verified program fees.",
  },
  {
    question: "Are donations tax deductible?",
    answer:
      "Consult a tax professional; we provide receipts where applicable.",
  },
  {
    question: "Can a local team request support?",
    answer:
      "Yes. Submit a program request through our Contact page and include your organization details, athlete count, and funding need.",
  },
  {
    question: "How quickly are donations distributed?",
    answer:
      "Approved programs typically receive allocations within 15 to 30 days after campaign closure.",
  },
  {
    question: "How does the monthly giving option work?",
    answer:
      "Monthly giving is a recurring pledge model that helps provide consistent year-round support for youth programs.",
  },
  {
    question: "When will store orders ship?",
    answer:
      "Most orders ship within 5 to 7 business days with tracking updates shared by email.",
  },
  {
    question: "What is your refund policy for merch?",
    answer:
      "Unworn items can be exchanged or refunded within 30 days of delivery.",
  },
  {
    question: "Can I sponsor one specific athlete?",
    answer:
      "You can choose Sponsor an Athlete on the Donate page, and support is routed through approved program pools.",
  },
  {
    question: "Do you share program impact reports?",
    answer:
      "Yes. We provide periodic summaries with participation metrics, support categories, and milestone highlights.",
  },
  {
    question: "How can my company become a partner?",
    answer:
      "Use the Request Partnership section on our Contact page. We collaborate on sponsorships, matching gifts, and event support.",
  },
];

export const teamMembers = [
  { name: "Lauren Evans", role: "Executive Director", image: "/images/placeholder.svg" },
  { name: "Marcus Hill", role: "Programs Lead", image: "/images/placeholder.svg" },
  { name: "Nina Patel", role: "Fundraising Operations", image: "/images/placeholder.svg" },
  { name: "Devon Reyes", role: "Community Partnerships", image: "/images/placeholder.svg" },
];

export const impactStories = [
  {
    title: "From Local Clinic to Regional Tournament",
    summary:
      "A community basketball clinic funded travel and equipment for 28 athletes, resulting in its first regional tournament appearance.",
    image: "/images/placeholder.svg",
  },
  {
    title: "Soccer Program Doubles Participation",
    summary:
      "With equipment grants and nutrition planning support, one youth soccer program grew from 40 to 84 active participants in 12 months.",
    image: "/images/placeholder.svg",
  },
];
