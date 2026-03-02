import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  subtitle: string;
  className?: string;
};

export function PageHero({ title, subtitle, className }: PageHeroProps) {
  return (
    <section className={cn("border-b border-border/70 bg-gradient-to-br from-primary via-primary to-[#13375f] py-16 text-primary-foreground", className)}>
      <div className="container">
        <h1 className="max-w-3xl text-4xl font-bold md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base text-primary-foreground/90 md:text-lg">{subtitle}</p>
      </div>
    </section>
  );
}
