"use client";

import toastLib, { Toaster as HotToaster, type ToastOptions } from "react-hot-toast";

// A wrapper object so you can seamlessly swap the toast dependency
export const toast = {
  success: (message: string, options?: ToastOptions) => toastLib.success(message, options),
  error: (message: string, options?: ToastOptions) => toastLib.error(message, options),
  loading: (message: string, options?: ToastOptions) => toastLib.loading(message, options),
  dismiss: (id?: string) => toastLib.dismiss(id),
};

// Wrap the library's toaster component so it can be safely injected globally
export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        // Define default styling that matches the app's premium design
        className:
          "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50  shadow-lg font-medium",
        style: {
          background: "var(--tw-bg-opacity)",
          color: "currentColor",
        },
      }}
    />
  );
}
