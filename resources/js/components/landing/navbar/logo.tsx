import * as React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

type LogoProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Control width with Tailwind on the wrapper (default scales by breakpoints) */
  wrapperClassName?: string;
};

export const Logo: React.FC<LogoProps> = ({ wrapperClassName, className, ...imgProps }) => {
  return (
    <div className={cn("w-30 sm:w-32 md:w-48 lg:w-64", wrapperClassName)}>
      <AspectRatio ratio={124 / 32}>
        <img
          src="/personaitor.png"            // /public/personaitor.png
          alt="Personaitor"
          className={cn("h-full w-full object-contain select-none", className)}
          loading="eager"
          decoding="async"
          draggable={false}
          {...imgProps}
        />
      </AspectRatio>
    </div>
  );
};
