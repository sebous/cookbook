import { REGEX } from "@/backend/constants/regex";
import React, { useRef, useState } from "react";

interface UrlInputProps {
  submitFn: (url: string) => void;
  isLoading: boolean;
}

export const UrlInput = ({ isLoading, submitFn }: UrlInputProps) => {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isUrlInvalid = !REGEX.URL.test(url) && url !== "";

  return (
    <>
      <div className="flex-1 mr-2">
        <input
          className={`input input-bordered ${
            isUrlInvalid ? "input-error" : ""
          } text-lg w-full`}
          type="text"
          ref={inputRef}
          placeholder="paste your url (https://some-bloated-cookbook.com/history-of-rice)"
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
        />
      </div>
      <div className="flex align-middle">
        <button
          className="btn btn-square mr-8 hidden md:flex"
          onClick={() => {
            setUrl("");
            inputRef.current?.focus();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          className={`btn btn-primary w-full md:w-min mt-4 md:mt-0 ${
            isLoading ? "loading" : ""
          }`}
          disabled={isUrlInvalid || url === ""}
          type="button"
          onClick={() => submitFn(url)}
        >
          {"process"}
        </button>
      </div>
    </>
  );
};
