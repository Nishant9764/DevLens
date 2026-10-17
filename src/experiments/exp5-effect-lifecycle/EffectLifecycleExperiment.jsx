// src/experiments/exp5-effect-lifecycle/EffectLifecycleExperiment.jsx
import React, { useState } from "react";
import { CodePanel } from "../../components/editor/CodePanel";
import { Radio, Power, MessageSquarePlus } from "lucide-react";
import styles from "./EffectLifecycleExperiment.module.css";

export function useEffectLifecycleExperiment() {
  const [isMounted, setIsMounted] = useState(true);
  const [roomId, setRoomId] = useState("general");
  const [draftCount, setDraftCount] = useState(0);
  const [lifecycleLog, setLifecycleLog] = useState([
    {
      id: 1,
      phase: "MOUNT EFFECT",
      detail: 'Connected to room "#general" (Initial mount after DOM commit)',
      type: "effect",
    },
  ]);
  const [lastTrigger, setLastTrigger] = useState("mount"); // 'mount' | 'dep-change' | 'unrelated-state' | 'unmount'

  const switchRoom = (nextRoom) => {
    if (nextRoom === roomId || !isMounted) return;
    const prevRoom = roomId;
    setRoomId(nextRoom);
    setLastTrigger("dep-change");
    setLifecycleLog((prev) => [
      {
        id: Date.now() + 1,
        phase: "2. NEW EFFECT",
        detail: `Connected to room "#${nextRoom}" (Dependency [${prevRoom} !== ${nextRoom}])`,
        type: "effect",
      },
      {
        id: Date.now(),
        phase: "1. CLEANUP PREV",
        detail: `Disconnected from "#${prevRoom}" (Cleanup ran before new effect)`,
        type: "cleanup",
      },
      ...prev.slice(0, 4),
    ]);
  };

  const triggerUnrelatedState = () => {
    if (!isMounted) return;
    setDraftCount((c) => c + 1);
    setLastTrigger("unrelated-state");
    setLifecycleLog((prev) => [
      {
        id: Date.now(),
        phase: "EFFECT SKIPPED",
        detail: `Component re-rendered (drafts = ${
          draftCount + 1
        }), but ["${roomId}"] === ["${roomId}"]`,
        type: "skip",
      },
      ...prev.slice(0, 5),
    ]);
  };

  const toggleMount = () => {
    if (isMounted) {
      setIsMounted(false);
      setLastTrigger("unmount");
      setLifecycleLog((prev) => [
        {
          id: Date.now(),
          phase: "UNMOUNT CLEANUP",
          detail: `Disconnected from "#${roomId}" (Component removed from DOM)`,
          type: "cleanup",
        },
        ...prev.slice(0, 5),
      ]);
    } else {
      setIsMounted(true);
      setLastTrigger("mount");
      setLifecycleLog((prev) => [
        {
          id: Date.now(),
          phase: "MOUNT EFFECT",
          detail: `Connected to room "#${roomId}" (Component mounted)`,
          type: "effect",
        },
        ...prev.slice(0, 5),
      ]);
    }
  };

  const code = `function ChatRoom({ roomId = "${roomId}" }) {
  const [drafts, setDrafts] = useState(${draftCount});

  useEffect(() => {
    // 1. Runs AFTER Commit when [roomId] changes:
    const connection = createConnection("${roomId}");
    connection.connect();

    // 2. Cleanup runs BEFORE next effect or on Unmount:
    return () => {
      connection.disconnect(); // leaves "${roomId}"
    };
  }, [roomId]); // <-- Dependency Array

  return <div>Active Room: #{roomId} (Drafts: {drafts})</div>;
}`;

  const activeLinesByTrigger = {
    mount: [4, 6, 7, 13],
    "dep-change": [4, 6, 7, 10, 11, 13],
    "unrelated-state": [2, 13, 15],
    unmount: [10, 11, 12],
  };

  const controls = (
    <div className={styles.controlsRow}>
      <div className={styles.controlItem}>
        <span className={styles.controlLabel}>
          Dependency <code>[roomId]</code>:
        </span>
        {["general", "react-internals", "design-systems"].map((room) => (
          <button
            key={room}
            disabled={!isMounted}
            onClick={() => switchRoom(room)}
            className={`${styles.roomBtn} ${
              roomId === room ? styles.roomActive : ""
            }`}
          >
            #{room}
          </button>
        ))}
      </div>

      <button onClick={toggleMount} className={styles.mountBtn}>
        <Power size={13} />{" "}
        {isMounted ? "Unmount Component" : "Mount Component"}
      </button>
    </div>
  );

  const codePanel = (
    <CodePanel
      code={code}
      activeLines={activeLinesByTrigger[lastTrigger] || [4, 13]}
      controls={controls}
      fileLabel="ChatRoomEffect.jsx"
    />
  );

  const previewPanel = (
    <div className={styles.previewArea}>
      {isMounted ? (
        <div className={styles.roomCard}>
          <div className={styles.roomHeader}>
            <span className={styles.liveIndicator}>
              <Radio size={13} /> Connected to <strong>#{roomId}</strong>
            </span>
            <span className={styles.depBadge}>
              Dep Array: <code>["{roomId}"]</code>
            </span>
          </div>

          <div className={styles.roomBody}>
            <div>
              <div className={styles.statLine}>
                Unrelated Local State (<code>drafts</code>):{" "}
                <strong>{draftCount}</strong>
              </div>
              <div className={styles.statHint}>
                Updating <code>drafts</code> re-renders <code>ChatRoom</code>,
                but does NOT reconnect the socket.
              </div>
            </div>

            <button onClick={triggerUnrelatedState} className={styles.draftBtn}>
              <MessageSquarePlus size={14} /> Increment Local State (drafts + 1)
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.unmountedCard}>
          <span>
            <code>&lt;ChatRoom /&gt;</code> is currently unmounted from the DOM.
          </span>
          <button onClick={toggleMount} className={styles.remountBtn}>
            Remount &lt;ChatRoom /&gt;
          </button>
        </div>
      )}
    </div>
  );

  const visualizerPanel = (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineHeader}>
        <span>SYNCHRONIZATION & EFFECT LIFECYCLE LOG (Newest First)</span>
        <span className={styles.depWatch}>
          Object.is(prevDep, nextDep) Check Active
        </span>
      </div>

      <div className={styles.logList}>
        {lifecycleLog.map((entry) => (
          <div
            key={entry.id}
            className={`${styles.logRow} ${
              entry.type === "effect"
                ? styles.rowEffect
                : entry.type === "cleanup"
                ? styles.rowCleanup
                : styles.rowSkip
            }`}
          >
            <span className={styles.phaseBadge}>{entry.phase}</span>
            <span className={styles.logDetail}>{entry.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const explanationPanel = (
    <div className={styles.effectExplanation}>
      <div>
        <h4>Effects Run After Commit & Compare Dependencies</h4>
        <p>
          Unlike event handlers (which run in response to a specific click),{" "}
          <code>useEffect</code> synchronizes a component with an external
          system (like a WebSocket or timer) <strong>after</strong> React
          commits the DOM update. On every re-render, React compares each item
          in the dependency array <code>[roomId]</code> using{" "}
          <code>Object.is</code>. When you increment <code>drafts</code>,{" "}
          <code>
            "{roomId}" === "{roomId}"
          </code>{" "}
          is true, so React skips re-running the effect.
        </p>
      </div>
      <div>
        <h4>Why Cleanup Runs Before the Next Effect</h4>
        <p>
          When <code>roomId</code> changes, React first calls the{" "}
          <strong>cleanup function returned from the previous render</strong>{" "}
          (closing the old room connection) before running the new effect for
          the new <code>roomId</code>. This prevents memory leaks and duplicate
          subscriptions.
        </p>
      </div>
    </div>
  );

  return {
    codePanel,
    previewPanel,
    visualizerPanel,
    explanationPanel,
  };
}
