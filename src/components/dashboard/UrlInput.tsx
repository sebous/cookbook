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
      <div className="flex-1 mr-2 flex align-middle">
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
        <button
          className="btn btn-square mr-2 ml-2"
          onClick={async () => {
            const text = await navigator.clipboard.readText();
            setUrl(text);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        </button>
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
      </div>
      <div className="flex align-middle"></div>
      <div>
        <button
          className={`btn btn-primary btn-block md:flex-1 mt-4 md:mt-0 ${
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
