export function ChessBackground({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-royal-radial text-bone">
      <div className="chessboard-mask pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(245,190,75,.08),transparent_24%,rgba(56,189,248,.06)_52%,transparent_78%)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-royal to-transparent" />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
