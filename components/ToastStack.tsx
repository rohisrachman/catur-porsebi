"use client";

export function ToastStack({ toasts }: { toasts: { id: string; message: string; type: string }[] }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-xl border px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-xl ${
            toast.type === "error"
              ? "border-red-300/40 bg-red-950/80 text-red-100"
              : "border-royal/40 bg-black/80 text-amber-100"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
