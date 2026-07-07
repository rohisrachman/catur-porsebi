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

  return (
    <ChessBackground>
      {actions.data ? (
        <>
          <TournamentHeader
            tournament={actions.data.tournament}
            connection={actions.connection}
            onFullscreen={toggleFullscreen}
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
