// resources/js/Pages/home/index.tsx (or similar)
import React from "react";
import { useEffect } from "react";
import CTABanner from "@/components/landing/cta-banner";
import FAQ from "@/components/landing/faq";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import type { InertiaFlash } from "@/types";
import { usePage } from "@inertiajs/react";
type Plan = {
  id: number | string;
  name: string;
  description?: string;
  price: number | string;              // <- may come as string from DB
  isPopular?: boolean;
  buttonText?: string;
  features: { title: string; tooltip?: string }[];
};

type PageProps = { plans: Plan[] };

export default function Home({ plans: plans }: PageProps) {
  const { props } = usePage();
  const flash = props.flash;

  // Automatically show any flash messages from Laravel
  useEffect(() => {
    if (!flash) return;

    Object.entries(flash).forEach(([type, message]) => {
      if (!message) return;
      switch (type) {
        case 'status':
        case 'success':
          toast.success(message as string);
          break;
        case 'info':
          toast(message as string);
          break;
        case 'warning':
          toast.warning(message as string);
          break;
        case 'error':
          toast.error(message as string);
          break;
      }
    });
  }, [flash]);

  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24">
        <Hero />
        <Features />
        <Pricing plans={plans} />
        <FAQ />
        <Testimonials />
        <CTABanner />
        <Footer />
      </main>
      <Toaster position="top-center" />
    </>
  );
}

