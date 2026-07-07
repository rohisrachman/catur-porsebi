"use client";

import { useCallback, useState } from "react";
import { BracketBoard } from "@/components/BracketBoard";
import { ChessBackground } from "@/components/ChessBackground";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ToastStack } from "@/components/ToastStack";
import { TournamentHeader } from "@/components/TournamentHeader";
import { useTournamentData } from "@/lib/useTournamentData";

export default function HomePage() {
  const actions = useTournamentData();
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => undefined);
      setFullscreen(true);
    } else {
      await document.exitFullscreen().catch(() => undefined);
      setFullscreen(false);
    }
  }, []);

  const downloadBracketScreenshot = useCallback(async () => {
    const target = document.getElementById("bracket-screenshot-target");
    if (!target) return;

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: 1,
        backgroundColor: "#07070b",
        canvasWidth: target.scrollWidth,
        canvasHeight: target.scrollHeight,
        width: target.scrollWidth,
        height: target.scrollHeight,
        style: {
          transform: "none",
          width: `${target.scrollWidth}px`,
          height: `${target.scrollHeight}px`
        }
      });
      const link = document.createElement("a");
      link.download = `catur-porsebi-bracket-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      window.alert("Gagal membuat screenshot bracket. Coba gunakan browser Chrome atau desktop.");
    }
  }, []);

  return (
    <ChessBackground>
      {actions.data ? (
        <>
          <TournamentHeader
            tournament={actions.data.tournament}
            connection={actions.connection}
            onFullscreen={toggleFullscreen}
            onScreenshot={downloadBracketScreenshot}
            fullscreen={fullscreen}
          />
          <BracketBoard data={actions.data} />
        </>
      ) : (
        <LoadingSkeleton />
      )}
      <ToastStack toasts={actions.toasts} />
    </ChessBackground>
  );
}
