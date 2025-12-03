import ALTFAQ from '@/components/landing/alt-faq';
import FAQ from '@/components/landing/faq';
import ReviewsAlt from '@/components/landing/alt-reviews';
import CTABanner from '@/components/landing/cta-banner';
import Footer from '@/components/landing/footer';
import Hero from '@/components/landing/hero';
import HowAndIndustries from '@/components/landing/how-it-works';
import { Navbar } from '@/components/landing/navbar';
import PainPoints3 from '@/components/landing/pain-points';
import Pricing from '@/components/landing/pricing';
import ProductInAction from '@/components/landing/product-in-action';
import ProofWall from '@/components/landing/proof-wall';
import Reviews3 from '@/components/landing/reviews';
import Solve from '@/components/landing/solve';
import Testimonials from '@/components/landing/testimonials';
import { Toaster } from '@/components/ui/sonner';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

type Plan = {
    id: number | string;
    name: string;
    description?: string;
    price: number | string; // <- may come as string from DB
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
            <main className="/*pt-16 xs:pt-20 sm:pt-24*/ main">
                {/* 1) Hero */}
                <Hero />
                {/* 2) Product in Action */}
                <ProductInAction />
                {/* 3) 3 REVIEWS */}
                <Reviews3 />
                {/* 4) 3 PAIN POINTS (make it hurt) */}
                <PainPoints3 />
                {/* 5) How we solve those issues */}
                <Solve />
                {/* 6) Reviews in a different format */}
                <Testimonials />
                {/* 7) Show Product (how it works…) + Industries we serve */}
                <HowAndIndustries />
                {/* 8) Pricing */}
                <Pricing plans={plans} />
                {/* 9) Proof Wall (Customer stories, why folks choose us…) */}
                <ProofWall />
                {/* 10) FAQ (with CTA beneath) */}
                <ALTFAQ />
                {/* 11) Final CTA band (optional, you already have one) */}
                <CTABanner />
                {/* 12) Footer */}
                <Footer />
            </main>

            <Toaster position="top-center" />
        </>
    );
}
