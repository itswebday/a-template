export type DropdownArrowProps = {
  className?: string;
};

const DropdownArrow: React.FC<DropdownArrowProps> = ({ className }) => {
  return (
    <figure
      className={`
        ${className}
      `}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 10L12 15L17 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </figure>
  );
};

export default DropdownArrow;
