import type React from "react";

export const BoxFullCenter = ({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) => (
	<div
		className={`flex flex-grow-1 w-full items-center justify-center ${className}`}
	>
		{children}
	</div>
);
