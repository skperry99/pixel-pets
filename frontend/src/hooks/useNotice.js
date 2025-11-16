import { createContext, useContext } from 'react';

/**
 * Context + hook for toast/notice API.
 *
 * Provided by <NoticeProvider>:
 *   const { notify } = useNotice();
 *   notify.success('Saved!');
 */
export const NoticeCtx = createContext(null);

/**
 * Access the global notice API.
 *
 * Must be used under <NoticeProvider>; otherwise throws a helpful error.
 */
export function useNotice() {
  const ctx = useContext(NoticeCtx);
  if (!ctx) {
    throw new Error('useNotice must be used inside <NoticeProvider>');
  }
  return ctx;
}
