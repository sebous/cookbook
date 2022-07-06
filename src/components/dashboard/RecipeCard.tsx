import React from "react";
interface Props {
  name: string;
  deleteFn: () => void;
}

export const RecipeCard = ({ name, deleteFn }: Props) => {
  return (
    <div className="card-compact card w-full bg-base-100 shadow-lg mb-4 rounded-lg">
      <div className="card-body flex flex-row align-middle">
        <h4 className="text-sm md:text-xl mb-0 font-normal flex-1 pr-8">
          {name}
        </h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteFn();
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
};
