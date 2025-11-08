import { createContext, useContext } from "react";

export const NoticeCtx = createContext(null);

export function useNotice() {
  const ctx = useContext(NoticeCtx);
  if (!ctx) throw new Error("useNotice must be used inside <NoticeProvider>");
  return ctx;
}
