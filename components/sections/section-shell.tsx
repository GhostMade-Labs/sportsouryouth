import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionShell({ id, eyebrow, title, description, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-20", className)}>
      <div className="container space-y-8">
        <div className="max-w-2xl space-y-3">
          {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p> : null}
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          {description ? <p className="text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
