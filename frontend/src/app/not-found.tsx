import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-(--content-pad-x) text-center relative overflow-hidden">

      {/* Background ambient effect */}
      <div className="absolute inset-0 bg-onyx z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-acid/5 rounded-full blur-3xl z-0" />

      <div className="relative z-10 flex flex-col items-center">

        {/* 404 Visual */}
        <div className="flex items-center justify-center gap-(--space-4) md:gap-(--space-5) mb-(--space-5) select-none">
          <span className="font-display text-[clamp(8rem,20vw,16rem)] leading-none text-bone/20">
            4
          </span>
          <div className="flex items-center justify-center relative w-[clamp(6rem,15vw,12rem)] h-[clamp(6rem,15vw,12rem)]">
            <div className="absolute inset-0 border-4 border-acid rounded-full" />
            <span className="font-display text-[clamp(2rem,4vw,3.5rem)] text-acid tracking-[0.02em] absolute">
              FLIQ
            </span>
          </div>
          <span className="font-display text-[clamp(8rem,20vw,16rem)] leading-none text-bone/20">
            4
          </span>
        </div>

        <h1 className="font-display text-(--text-display) tracking-[0.02em] mb-(--space-3)">
          THIS PAGE IS SOLD OUT.
        </h1>

        <p className="font-body text-muted max-w-md mb-(--space-6)">
          The drop you&apos;re looking for doesn&apos;t exist or has been archived. Go back and find your next piece.
        </p>

        <div className="flex flex-col sm:flex-row gap-(--space-3) w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full">BACK TO HOME</Button>
          </Link>
          <Link href="/shop" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full">SHOP ALL DROPS</Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
