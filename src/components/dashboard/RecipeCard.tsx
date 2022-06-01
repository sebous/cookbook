import React from "react";
interface Props {
  name: string;
}

export const RecipeCard = ({ name }: Props) => {
  return (
    <div className="card w-full bg-base-100 shadow-lg mb-4">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        {/* <p>text...</p> */}
      </div>
    </div>
  );
};
