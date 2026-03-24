import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-10 w-10 text-xl",
  md: "h-12 w-12 text-2xl",
  lg: "h-14 w-14 text-[1.75rem]"
} as const;

export function BrandMark({ className, size = "md" }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-[18px] border border-[color:var(--border-warm)] bg-[linear-gradient(180deg,rgba(230,212,184,0.12),rgba(17,197,198,0.08))] text-[color:var(--accent-warm)] shadow-[var(--bet-glow-warm)]",
        sizeMap[size],
        className
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,235,221,0.22),transparent_55%)]" />
      <span className="relative font-display font-semibold leading-none">B</span>
    </span>
  );
}