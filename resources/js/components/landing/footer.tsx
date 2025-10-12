'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from 'lucide-react';
import { Logo } from './logo';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

const footerLinks = [
  { title: 'Features', href: '#features' },
  { title: 'Pricing', href: '#pricing' },
  { title: 'FAQ', href: '#faq' },
  { title: 'Testimonials', href: '#testimonials' },
  { title: 'Privacy Policy', href: '/privacy-policy' },
  { title: 'Terms of Use', href: '/terms' },
];

const Footer = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    if (!email) return;

    router.post(
      route('newsletter.subscribe'),
      { email },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Subscribed successfully!');
          if (emailRef.current) emailRef.current.value = '';
        },
        onError: (errors) => {
          if (errors.email) toast.error(errors.email);
        },
      }
    );
  };

  return (
    <footer className="dark mt-40 bg-background text-foreground dark:border-t">
      <div className="mx-auto max-w-(--breakpoint-xl)">
        <div className="flex flex-col items-start justify-between gap-x-8 gap-y-10 px-6 py-12 sm:flex-row xl:px-0">
          <div>
            {/* Logo */}
            <Logo />

            <ul className="mt-6 flex flex-wrap items-center gap-4">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <a
                    href={href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe Newsletter */}
          <div className="w-full max-w-xs">
            <h6 className="font-semibold">Stay up to date</h6>
            <form
              className="mt-6 flex items-center gap-2"
              onSubmit={handleSubscribe}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                required
                ref={emailRef}
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col-reverse items-center justify-between gap-x-2 gap-y-5 px-6 py-8 sm:flex-row xl:px-0">
          {/* Copyright */}
          <span className="text-center text-muted-foreground sm:text-start">
            &copy; {new Date().getFullYear()}{' '}
            <a href="/" target="_blank">
              {import.meta.env.VITE_APP_NAME}
            </a>
            . All rights reserved.
          </span>

          <div className="flex items-center gap-5 text-muted-foreground">
            <a href="#" target="_blank">
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" target="_blank">
              <DribbbleIcon className="h-5 w-5" />
            </a>
            <a href="#" target="_blank">
              <TwitchIcon className="h-5 w-5" />
            </a>
            <a href="#" target="_blank">
              <GithubIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;