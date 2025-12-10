import { twMerge } from "tailwind-merge";
import type { Media, ProcessBlock } from "@/payload-types";
import { getPaddingClasses } from "@/utils";
import ProcessClient, { type ProcessStepData } from "./ProcessClient";

const Process: React.FC<ProcessBlock> = ({
  steps,
  dark,
  paddingTop,
  paddingBottom,
}) => {
  // Process steps data for SEO and prerendering
  const processedSteps: ProcessStepData[] =
    steps && steps.length > 0
      ? steps.map((step, index) => {
          // Step image
          const stepImage =
            typeof step.image === "object" &&
            step.image !== null &&
            "url" in step.image
              ? (step.image as Media)
              : null;

          // Layout variant
          let layoutVariant = index % 3;

          if (index === 2) {
            layoutVariant = 0;
          } else if (index === 3) {
            layoutVariant = 2;
          }

          // Return processed step
          return {
            id: step.id || index,
            number: step.number || null,
            title: step.title || null,
            description: step.description || null,
            image: stepImage
              ? {
                  alt: stepImage.alt || null,
                  url: stepImage.url || null,
                }
              : null,
            imageUrl: stepImage?.url
              ? `${process.env.NEXT_PUBLIC_SERVER_URL}${stepImage.url}`
              : null,
            imageAlt: (stepImage && "alt" in stepImage && stepImage.alt) || "",
            layoutVariant,
          };
        })
      : [];

  return (
    <section
      className={twMerge(
        "w-full overflow-hidden",
        dark && "bg-dark text-white",
        getPaddingClasses(paddingTop, paddingBottom),
      )}
    >
      {/* Container */}
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className={twMerge("flex flex-col gap-8", "de:gap-12")}>
          {/* Process swiper */}
          <div className="overflow-visible">
            <ProcessClient steps={processedSteps} dark={dark} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
