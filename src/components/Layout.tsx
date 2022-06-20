import React, { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto min-h-[calc(100%-70px)] flex">
        {children}
      </div>
    </>
  );
};
