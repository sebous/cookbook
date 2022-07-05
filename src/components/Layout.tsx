import React, { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="bg-base-300">
      <Navbar />
      <div className="container mx-auto flex min-h-[calc(100vh-70px)] pt-2 md:pt-8">
        {children}
      </div>
    </div>
  );
};
