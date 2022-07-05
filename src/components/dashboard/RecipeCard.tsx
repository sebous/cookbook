import React from "react";
interface Props {
  name: string;
}

export const RecipeCard = ({ name }: Props) => {
  return (
    <div className="card-compact card w-full bg-base-100 shadow-lg mb-4 rounded-lg">
      <div className="card-body">
        <h4 className="text-sm md:text-xl mb-0 font-normal">{name}</h4>
      </div>
    </div>
  );
};
