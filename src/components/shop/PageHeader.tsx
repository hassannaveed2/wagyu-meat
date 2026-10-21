import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

/** Title band used at the top of inner pages; dark with a photo when `image` is given. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  image?: string | null;
  children?: ReactNode;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden", image ? "bg-sumi text-paper" : "bg-paper-2 text-ink")}>
      {image && (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-45" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sumi via-sumi/70 to-sumi/20" />
        </>
      )}
      <Container className={cn(image ? "py-16 sm:py-24" : "py-12 sm:py-16")}>
        <div className="max-w-2xl animate-fade-up">
          {eyebrow && <p className={cn("eyebrow", image && "text-gold")}>{eyebrow}</p>}
          <h1 className="display mt-3 text-[2.3rem] sm:text-5xl">{title}</h1>
          {lede && <p className={cn("mt-4 text-[1.05rem] leading-relaxed", image ? "text-paper/80" : "text-ink-2")}>{lede}</p>}
          {children}
        </div>
      </Container>
    </section>
  );
}
