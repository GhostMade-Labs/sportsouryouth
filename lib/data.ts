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
    description: "Proceeds are allocated to clinics and tournaments.",
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
  category: "Hoodie" | "T-Shirt";
  price: number;
  image: string;
  colors: string[];
  sizes: string[];
  description: string;
};

export type ArtworkCollection = {
  id: string;
  artworkName: string;
  sport: "Basketball" | "Softball" | "Football" | "Hockey" | "Soccer";
  description: string;
  tshirt: Product;
  hoodie: Product;
};

const merchSizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

export const artworkCollections: ArtworkCollection[] = [
  {
    id: "play-like-girl",
    artworkName: "Play Like A Girl",
    sport: "Softball",
    description: "Retro gradient softball art with bold game-day energy.",
    tshirt: {
      id: "play-like-girl-tee",
      name: "Play Like A Girl Street Tee",
      category: "T-Shirt",
      price: 32,
      image: "/images/store-artworks/play-like-girl-tee.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Soft cotton tee with full-front Play Like A Girl print.",
    },
    hoodie: {
      id: "play-like-girl-hoodie",
      name: "Play Like A Girl Night Hoodie",
      category: "Hoodie",
      price: 50,
      image: "/images/store-artworks/play-like-girl-hoodie.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Pullover hoodie featuring the same vivid softball artwork.",
    },
  },
  {
    id: "softball-girl-neon",
    artworkName: "Softball Girl Neon",
    sport: "Softball",
    description: "Clean varsity lettering with a bright neon pop.",
    tshirt: {
      id: "softball-girl-neon-tee",
      name: "Softball Girl Glow Tee",
      category: "T-Shirt",
      price: 32,
      image: "/images/store-artworks/softball-girl-neon-tee.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Classic fit tee with Softball Girl neon print.",
    },
    hoodie: {
      id: "softball-girl-neon-hoodie",
      name: "Softball Girl Glow Hoodie",
      category: "Hoodie",
      price: 50,
      image: "/images/store-artworks/softball-girl-neon-hoodie.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Premium hoodie with the Softball Girl neon chest artwork.",
    },
  },
  {
    id: "orange-arc",
    artworkName: "Orange Arc Mark",
    sport: "Softball",
    description: "Minimal orange mark inspired by softball motion and speed.",
    tshirt: {
      id: "orange-arc-tee",
      name: "Orange Arc Signature Tee",
      category: "T-Shirt",
      price: 32,
      image: "/images/store-artworks/orange-arc-tee.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Everyday tee with the Orange Arc front graphic.",
    },
    hoodie: {
      id: "orange-arc-hoodie",
      name: "Orange Arc Signature Hoodie",
      category: "Hoodie",
      price: 50,
      image: "/images/store-artworks/orange-arc-hoodie.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Warm hoodie with oversized Orange Arc chest print.",
    },
  },
  {
    id: "eat-sleep-basketball-repeat",
    artworkName: "Eat Sleep Basketball Repeat",
    sport: "Basketball",
    description: "Vintage basketball statement design in game-night orange.",
    tshirt: {
      id: "eat-sleep-basketball-repeat-tee",
      name: "Repeat Grind Tee",
      category: "T-Shirt",
      price: 32,
      image: "/images/store-artworks/eat-sleep-basketball-repeat-tee.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Lightweight tee with Eat Sleep Basketball Repeat print.",
    },
    hoodie: {
      id: "eat-sleep-basketball-repeat-hoodie",
      name: "Repeat Grind Hoodie",
      category: "Hoodie",
      price: 50,
      image: "/images/store-artworks/eat-sleep-basketball-repeat-hoodie.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Pullover hoodie featuring the Repeat basketball artwork.",
    },
  },
  {
    id: "hoop-lexicon",
    artworkName: "Hoop Lexicon",
    sport: "Basketball",
    description: "Texture-heavy half-ball art built from basketball terms.",
    tshirt: {
      id: "hoop-lexicon-tee",
      name: "Hoop Lexicon Tee",
      category: "T-Shirt",
      price: 32,
      image: "/images/store-artworks/hoop-lexicon-tee.png",
      colors: ["Midnight"],
      sizes: merchSizes,
      description: "Performance tee with typographic Hoop Lexicon print.",
    },
    hoodie: {
      id: "hoop-lexicon-hoodie",
      name: "Hoop Lexicon Hoodie",
      category: "Hoodie",
      price: 50,
      image: "/images/store-artworks/hoop-lexicon-hoodie.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Heavy fleece hoodie with the Hoop Lexicon chest artwork.",
    },
  },
  {
    id: "neon-ice-breaker",
    artworkName: "Neon Ice Breaker",
    sport: "Hockey",
    description: "Electric neon skater outline for high-speed hockey style.",
    tshirt: {
      id: "neon-ice-breaker-tee",
      name: "Neon Ice Breaker Tee",
      category: "T-Shirt",
      price: 32,
      image: "/images/store-artworks/neon-ice-breaker-tee.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Graphic tee with full neon skater front illustration.",
    },
    hoodie: {
      id: "neon-ice-breaker-hoodie",
      name: "Neon Ice Breaker Hoodie",
      category: "Hoodie",
      price: 50,
      image: "/images/store-artworks/neon-ice-breaker-hoodie.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Cozy hoodie featuring the neon hockey skater artwork.",
    },
  },
  {
    id: "eat-hockey-sleep-repeat",
    artworkName: "Eat Hockey Sleep Repeat",
    sport: "Hockey",
    description: "Cold-blue action lettering with a skating power stance.",
    tshirt: {
      id: "eat-hockey-sleep-repeat-tee",
      name: "Blue Line Repeat Tee",
      category: "T-Shirt",
      price: 32,
      image: "/images/store-artworks/eat-hockey-sleep-repeat-tee.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Athletic tee with Eat Hockey Sleep Repeat artwork.",
    },
    hoodie: {
      id: "eat-hockey-sleep-repeat-hoodie",
      name: "Blue Line Repeat Hoodie",
      category: "Hoodie",
      price: 50,
      image: "/images/store-artworks/eat-hockey-sleep-repeat-hoodie.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Black hoodie with neon-blue hockey repeat design.",
    },
  },
  {
    id: "bring-it-usa",
    artworkName: "Bring It USA",
    sport: "Soccer",
    description: "Patriotic soccer crest artwork with bold brush lettering.",
    tshirt: {
      id: "bring-it-usa-tee",
      name: "Bring It USA Tee",
      category: "T-Shirt",
      price: 32,
      image: "/images/store-artworks/bring-it-usa-tee.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Soccer-themed tee with Bring It USA front graphic.",
    },
    hoodie: {
      id: "bring-it-usa-hoodie",
      name: "Bring It USA Hoodie",
      category: "Hoodie",
      price: 50,
      image: "/images/store-artworks/bring-it-usa-hoodie.png",
      colors: ["Black"],
      sizes: merchSizes,
      description: "Hoodie with oversized patriotic soccer emblem print.",
    },
  },
  {
    id: "gridiron-splash",
    artworkName: "Gridiron Splash",
    sport: "Football",
    description: "Dynamic football catch artwork with textured splash detail.",
    tshirt: {
      id: "gridiron-splash-tee",
      name: "Gridiron Splash Tee",
      category: "T-Shirt",
      price: 32,
      image: "/images/store-artworks/gridiron-splash-tee.png",
      colors: ["White"],
      sizes: merchSizes,
      description: "White tee with full-color Gridiron Splash illustration.",
    },
    hoodie: {
      id: "gridiron-splash-hoodie",
      name: "Gridiron Splash Hoodie",
      category: "Hoodie",
      price: 50,
      image: "/images/store-artworks/gridiron-splash-hoodie.png",
      colors: ["White"],
      sizes: merchSizes,
      description: "White fleece hoodie featuring the Gridiron Splash print.",
    },
  },
  {
    id: "be-legendary",
    artworkName: "Be Legendary",
    sport: "Soccer",
    description: "Minimal monochrome soccer badge designed for clean streetwear.",
    tshirt: {
      id: "be-legendary-tee",
      name: "Be Legendary Tee",
      category: "T-Shirt",
      price: 32,
      image: "/images/store-artworks/be-legendary-tee.png",
      colors: ["White"],
      sizes: merchSizes,
      description: "White cotton tee with Be Legendary soccer emblem.",
    },
    hoodie: {
      id: "be-legendary-hoodie",
      name: "Be Legendary Hoodie",
      category: "Hoodie",
      price: 50,
      image: "/images/store-artworks/be-legendary-hoodie.png",
      colors: ["White"],
      sizes: merchSizes,
      description: "White hoodie with high-contrast Be Legendary front print.",
    },
  },
];

export type ProgramProfile = {
  sport: string;
  region: string;
  ages: string;
  focus: string;
  paragraph: string;
};

export const programProfiles: ProgramProfile[] = [
  {
    sport: "Basketball",
    region: "Delaware, Maryland, Virginia, Washington, DC",
    ages: "Ages 6-17",
    focus: "Clinics to Tournament Play",
    paragraph:
      "Basketball programs across Delaware, Maryland, Virginia, and the Washington, DC area have built a strong, long-running tradition of developing young athletes through community-based organizations. For decades, these programs have welcomed thousands of players ages 6-17, offering a full pathway from beginner clinics to competitive tournament play. Many organizations in these regions began in the 1970s and have continued to grow, shaping generations of youth athletes. Skill-building clinics introduce young players to fundamentals such as ball handling, shooting, footwork, and teamwork. As athletes progress, they move into structured training environments that emphasize discipline, conditioning, and game strategy. Seasonal leagues provide consistent opportunities for real competition, helping players apply their skills in meaningful game situations. Regional tournaments bring teams together from multiple states, creating exciting matchups and fostering a strong sense of community pride. Coaches across these programs focus on character development as much as athletic growth, reinforcing sportsmanship and accountability. Families and local supporters play a major role in sustaining these efforts, ensuring that young athletes have access to positive, motivating environments. Over the years, many talented players have started their journey in programs like these, gaining early exposure to high-quality coaching and competition that helped shape their long-term love for the game.",
  },
  {
    sport: "Football",
    region: "Florida and Georgia",
    ages: "Ages 6-17",
    focus: "Year-Round Development",
    paragraph:
      "Youth football programs in Florida and Georgia provide a strong developmental pathway for young athletes across both states. These programs have grown steadily over the years, offering structured training for players ages 6-17. Coaches focus on teaching fundamentals such as footwork, agility, teamwork, and discipline. Seasonal leagues give athletes consistent opportunities to compete and apply their skills in real game situations. Many communities host well-organized tournaments that bring together teams from across the region. Clinics throughout the year help beginners build confidence while giving advanced players a chance to sharpen their technique. Families and local supporters play an important role in sustaining these programs and creating a positive environment. The warm climate in both states allows for extended outdoor training seasons, giving players more time on the field. Youth football in Florida and Georgia continues to grow as more athletes join each year. Through these programs, young players develop not only athletic ability but also character, leadership, and a lasting love for the game.",
  },
  {
    sport: "Baseball and Girls Softball",
    region: "New York, New Jersey, Connecticut",
    ages: "Ages 6-17",
    focus: "14 Competitive Little League Teams",
    paragraph:
      "The New York, New Jersey, and Connecticut region hosts a well-established youth baseball network that includes 14 competitive Little League teams. These teams have been active since 2015, providing consistent support and opportunities for young athletes across the Tri-State area. Over the years, the programs have trained thousands of players between the ages of 6 and 17. Each season offers a complete developmental pathway that begins with introductory peewee clinics. As players grow, they advance into structured training sessions designed to build core baseball fundamentals. Older athletes transition into senior-level competition, where they face higher-level opponents and more demanding gameplay. The league emphasizes strong coaching, discipline, and teamwork at every stage of development. Seasonal leagues give players regular game experience, helping them sharpen their skills in real competitive environments. Well-organized tournaments bring teams together from across the region, creating memorable and challenging matchups. Through this system, young athletes gain the confidence, experience, and preparation needed to excel both on and off the field.",
  },
  {
    sport: "Soccer",
    region: "Northern and Southern California",
    ages: "Ages 6-18",
    focus: "12 Tournaments and Clinics",
    paragraph:
      "Northern and Southern California have built a strong and enduring presence through 12 well-organized tournaments and clinics that serve young athletes year-round. These programs have been active for decades, creating a structured pathway for players ages 6-18 to learn, grow, and compete. Clinics introduce beginners to essential skills such as dribbling, passing, footwork, and teamwork in a supportive environment. As players advance, they participate in more intensive training sessions that focus on strategy, conditioning, and game awareness. Seasonal tournaments bring together teams from across both regions, creating exciting matchups and valuable competitive experience. Coaches emphasize discipline, sportsmanship, and steady improvement as core elements of each program. Families and local communities play a major role in supporting these events, helping maintain a positive and motivating atmosphere. The combination of clinics and tournaments ensures that players receive both instruction and real-game opportunities. Many young athletes develop long-lasting friendships and a strong sense of confidence through these programs. Over the years, Northern and Southern California soccer communities have helped shape thousands of players who carry their love for the game into high school, club, and beyond.",
  },
  {
    sport: "Hockey",
    region: "New York, Massachusetts, Rhode Island",
    ages: "Youth Development Pipeline",
    focus: "4 Organizations Since the 1970s",
    paragraph:
      "The northeast region of New York, Massachusetts, and Rhode Island is home to four long-standing hockey organizations with roots reaching back to the 1970s. These programs have grown into well-established community pillars that now serve more than 13,000 young athletes each year. They offer a full range of development opportunities designed to support players at every stage of their growth. Young athletes begin with foundational skill-building clinics that introduce skating, puck control, and teamwork. As they advance, they participate in structured practices that strengthen fundamentals and build confidence on the ice. Competitive tournaments bring together teams from across the region, creating exciting matchups and valuable game experience. Coaches emphasize discipline, sportsmanship, and steady improvement as core elements of the training environment. Families and local communities provide strong support, helping the programs maintain a positive and motivating atmosphere. The organizations continue to evolve while staying committed to developing well-rounded young players. Through this system, thousands of athletes gain the skills, experience, and passion needed to build a lifelong love for the game.",
  },
];

export const products: Product[] = artworkCollections.flatMap((artwork) => [artwork.tshirt, artwork.hoodie]);

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
    question: "How quickly are donations distributed?",
    answer:
      "Approved programs typically receive allocations within 15 to 30 days after campaign closure.",
  },
  {
    question: "When will store orders ship?",
    answer:
      "Most orders ship within 5 to 7 business days with tracking updates shared by email.",
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

