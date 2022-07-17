import { Reorder, useMotionValue, animate, MotionValue } from "framer-motion";
import Link from "next/link";
import React, { useEffect } from "react";
import useBreakpoint from "use-breakpoint";
interface Props {
  name: string;
  id: string;
  deleteFn: () => void;
}
const BREAKPOINTS = { mobile: 0, desktop: 1024 };

export const RecipeCard = ({ name, deleteFn, id }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const { breakpoint } = useBreakpoint(BREAKPOINTS);

  return (
    <Reorder.Item
      value={id}
      id={id}
      style={{ y, boxShadow }}
      dragListener={breakpoint === "desktop"}
    >
      <div className="card-compact card w-full bg-base-100 shadow-lg mb-4 rounded-lg">
        <div className="card-body flex flex-row items-center">
          <Link href={`/recipe/${id}`} className="">
            <a>
              <h4 className="text-sm md:text-xl mb-0 font-normal pr-8">
                {name}
              </h4>
            </a>
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 ml-auto flex-shrink-0"
            fill="none"
            cursor={"pointer"}
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
    </Reorder.Item>
  );
};

const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

export function useRaisedShadow(value: MotionValue<number>) {
  const boxShadow = useMotionValue(inactiveShadow);

  useEffect(() => {
    let isActive = false;
    value.onChange((latest) => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          animate(boxShadow, "5px 5px 10px rgba(0,0,0,0.3)");
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow);
        }
      }
    });
  }, [value, boxShadow]);

  return boxShadow;
}
