import {
  Blocks,
  Bot,
  ChartPie,
  Film,
  MessageCircle,
  Settings2,
} from "lucide-react";
import React from "react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Personas",
    description:
      "Generate fully detailed user personas including goals, pain points, demographics, and behavioral patterns automatically.",
  },
  {
    icon: Settings2,
    title: "Customizable Profiles",
    description:
      "Edit generated personas to match your specific project needs or industry context with a few clicks.",
  },
  {
    icon: Blocks,
    title: "Instant Insights",
    description:
      "Understand your audience instantly to design better products, campaigns, and marketing strategies.",
  },
  {
    icon: Film,
    title: "Export & Share",
    description:
      "Download your personas in PDF, JSON, or CSV to share with your team or clients seamlessly.",
  },
  {
    icon: ChartPie,
    title: "Data-Driven Accuracy",
    description:
      "Our AI uses patterns and best practices to create realistic, actionable personas you can rely on.",
  },
  {
    icon: MessageCircle,
    title: "Team Collaboration",
    description:
      "Collaborate with your team on persona projects, leave comments, and track updates efficiently.",
  },
];

const Features = () => {
  return (
    <div id="features" className="w-full py-12 xs:py-20 px-6">
      <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center">
        Unleash Your Creativity
      </h2>
      <div className="w-full max-w-(--breakpoint-lg) mx-auto mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col bg-background border rounded-xl py-6 px-5"
          >
            <div className="mb-3 h-10 w-10 flex items-center justify-center bg-primary rounded-full">
              <feature.icon className="h-6 w-6" color="white" />
            </div>
            <span className="text-lg font-semibold">{feature.title}</span>
            <p className="mt-1 text-foreground/80 text-[15px]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
