import React, { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-8">{children}</div>
    </>
  );
};
