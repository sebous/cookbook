import type React from "react";

export const BoxFullCenter = ({ children }: React.PropsWithChildren<{}>) => (
  <div className="flex flex-grow-1 w-full items-center justify-center">
    {children}
  </div>
);
