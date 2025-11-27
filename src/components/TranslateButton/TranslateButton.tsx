import { NavLink } from "@/components";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import { LocaleOption } from "@/types";
import { getLocale } from "next-intl/server";

type TranslateButtonProps = {
  className?: string;
};

const TranslateButton: React.FC<TranslateButtonProps> = async ({
  className,
}) => {
  const locale = (await getLocale()) as LocaleOption;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {LOCALES.map((loc, index) => {
        const href = loc === DEFAULT_LOCALE ? "/" : `/${loc}`;
        const isActive = loc === locale;

        return (
          <div key={loc} className="flex items-center gap-2">
            <NavLink
              className={`
                px-2 text-[12px] transition-opacity duration-200
                ${isActive && "opacity-70"}
              `}
              href={isActive ? undefined : href}
            >
              {loc.toUpperCase()}
            </NavLink>
            {index < LOCALES.length - 1 && (
              <div className="w-px h-4 bg-white" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TranslateButton;
