import {
  BadgeDollarSign,
  Route,
  ShieldCheck,
  Truck,
  Undo2,
  UserRoundCheck,
} from "lucide-react";

const faq = [
  {
    icon: Undo2,
    question: "What is a Persona Generator?",
    answer:
      "It’s an AI-powered tool that creates realistic user personas for your target audience, saving you hours of research.",
  },
  {
    icon: Route,
    question: "How does it help my business?",
    answer:
      "By generating accurate personas, you can tailor products, campaigns, and strategies that resonate with real users.",
  },
  {
    icon: Truck,
    question: "Can I customize the personas?",
    answer:
      "Yes! Each persona is editable so you can fine-tune attributes like goals, demographics, and behaviors to match your context.",
  },
  {
    icon: BadgeDollarSign,
    question: "What output formats are available?",
    answer:
      "Export your personas as PDF, JSON, or CSV to easily integrate with your workflows or presentations.",
  },
  {
    icon: ShieldCheck,
    question: "Is the data generated reliable?",
    answer:
      "Our AI uses real-world patterns and best practices to ensure the personas are realistic and actionable.",
  },
  {
    icon: UserRoundCheck,
    question: "Who can use this tool?",
    answer:
      "Product managers, marketers, UX designers, and teams who want to understand their audience better can benefit instantly.",
  },
];


const FAQ = () => {
  return (
    <div
      id="faq"
      className="min-h-screen flex items-center justify-center px-6 py-12 xs:py-20"
    >
      <div className="max-w-(--breakpoint-lg)">
        <h2 className="text-3xl xs:text-4xl md:text-5xl leading-[1.15]! font-bold tracking-tight text-center">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 xs:text-lg text-center text-muted-foreground">
          Quick answers to common questions about our products and services.
        </p>

        <div className="mt-12 grid md:grid-cols-2 bg-background rounded-xl overflow-hidden outline outline-[1px] outline-border outline-offset-[-1px]">
          {faq.map(({ question, answer, icon: Icon }) => (
            <div key={question} className="border p-6 -mt-px -ml-px">
              <div className="h-8 w-8 xs:h-10 xs:w-10 flex items-center justify-center rounded-full bg-primary">
                <Icon className="h-4 w-4 xs:h-6 xs:w-6" color="white" />
              </div>
              <div className="mt-3 mb-2 flex items-start gap-2 text-lg xs:text-[1.35rem] font-semibold tracking-tight">
                <span>{question}</span>
              </div>
              <p className="text-sm xs:text-base">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
