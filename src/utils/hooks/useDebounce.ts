import { useMemo } from "react";

import debounce from "debounce";

type DebouncedFn = (...args: any[]) => any;
export const useDebounce = <T extends DebouncedFn>(fn: T, wait = 200) =>
  useMemo(() => debounce(fn, wait), [fn, wait]);
