import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Marquee from "@/components/landing/ui/marquee";
// import Link from "next/link";
import React, { ComponentProps } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Thompson",
    designation: "Product Manager",
    company: "NextWave Labs",
    testimonial:
      "Persona Generator has completely changed how we approach user research. We can now generate accurate personas in minutes, saving hours of manual work.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "David Kim",
    designation: "Marketing Lead",
    company: "BrightMark Agency",
    testimonial:
      "The AI-powered personas give us deep insights into our audience. Campaign targeting has never been easier or more precise.",
    avatar: "https://randomuser.me/api/portraits/men/31.jpg",
  },
  {
    id: 3,
    name: "Laura Chen",
    designation: "UX Designer",
    company: "PixelCraft Studio",
    testimonial:
      "Generating user personas on the fly lets me design interfaces that truly resonate with users. It’s like having a mini research team in my pocket.",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    designation: "Founder & CEO",
    company: "StartSmart",
    testimonial:
      "Persona Generator helped us understand our early adopters and refine our product roadmap. We launched with confidence knowing our features matched real user needs.",
    avatar: "https://randomuser.me/api/portraits/men/18.jpg",
  },
  {
    id: 5,
    name: "Isabella Garcia",
    designation: "Growth Strategist",
    company: "ScaleUp Agency",
    testimonial:
      "With clear personas generated in seconds, our ad campaigns now convert at a much higher rate. The insights are actionable and precise.",
    avatar: "https://randomuser.me/api/portraits/women/35.jpg",
  },
  {
    id: 6,
    name: "Michael Brown",
    designation: "Product Designer",
    company: "Creative Loop",
    testimonial:
      "I can iterate on designs faster because I understand the user personas better. This tool bridges the gap between assumptions and real insights.",
    avatar: "https://randomuser.me/api/portraits/men/27.jpg",
  },
];

const Testimonials = () => (
  <div id="testimonials" className="flex justify-center items-center py-20">
    <div className="h-full w-full">
      <h2 className="mb-12 text-4xl md:text-5xl font-bold text-center tracking-tight px-6">
        Testimonials
      </h2>
      <div className="relative">
        <div className="z-10 absolute left-0 inset-y-0 w-[15%] bg-linear-to-r from-background to-transparent" />
        <div className="z-10 absolute right-0 inset-y-0 w-[15%] bg-linear-to-l from-background to-transparent" />
        <Marquee pauseOnHover className="[--duration:20s]">
          <TestimonialList />
        </Marquee>
        <Marquee pauseOnHover reverse className="mt-4 [--duration:20s]">
          <TestimonialList />
        </Marquee>
      </div>
    </div>
  </div>
);

const TestimonialList = () =>
  testimonials.map((testimonial) => (
    <div
      key={testimonial.id}
      className="min-w-96 max-w-sm bg-accent rounded-xl p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.designation}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <a href="#" target="_blank">
            <TwitterLogo className="w-4 h-4" />
          </a>
        </Button>
      </div>
      <p className="mt-5 text-[17px]">{testimonial.testimonial}</p>
    </div>
  ));

const TwitterLogo = (props: ComponentProps<"svg">) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>X</title>
    <path
      fill="currentColor"
      d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
    />
  </svg>
);

export default Testimonials;
