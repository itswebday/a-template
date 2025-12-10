import { twMerge } from "tailwind-merge";

export type DropdownArrowProps = {
  className?: string;
};

const DropdownArrow: React.FC<DropdownArrowProps> = ({ className }) => {
  return (
    <figure className={twMerge(className)}>
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 10L12 15L17 10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </figure>
  );
};

export default DropdownArrow;
