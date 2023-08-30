import { useState } from "react";

export const ShareBtn = () => {
	const [isToastActive, setIsToastActive] = useState(false);

	return (
		<>
			<div
				className={`w-10 h-10 flex justify-center items-center rounded-md cursor-pointer hover:bg-base-100 `}
				data-tip="Copied"
				onClick={() => {
					navigator.clipboard.writeText(location.href);
					setIsToastActive(true);
					setTimeout(() => setIsToastActive(false), 5000);
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					aria-hidden="true"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
					></path>
				</svg>
			</div>
			{isToastActive && (
				<div
					className="toast cursor-default"
					onClick={() => setIsToastActive(false)}
				>
					<div className="alert alert-info">Copied to clipboard</div>
				</div>
			)}
		</>
	);
};
