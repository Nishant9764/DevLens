// src/App.jsx
import React, { useState, useEffect } from "react";
import { EXPERIMENTS } from "./experiments";
import { AppShell } from "./components/layout/AppShell";
import { Sidebar } from "./components/layout/Sidebar";
import { ErrorBoundary } from "./components/preview/ErrorBoundary";
import { useJsVsReactExperiment } from "./experiments/exp1-js-vs-react/JsVsReactExperiment";
import { useRenderVisualizerExperiment } from "./experiments/exp2-render-pipeline/RenderVisualizerExperiment";
import { useComponentExplorerExperiment } from "./experiments/exp3-component-explorer/ComponentExplorerExperiment";
import { useStateBatchingExperiment } from "./experiments/exp4-state-batching/StateBatchingExperiment";
import { useEffectLifecycleExperiment } from "./experiments/exp5-effect-lifecycle/EffectLifecycleExperiment";
import { RotateCcw } from "lucide-react";
import "./styles/global.css";

function ActiveLabSession({ activeId }) {
  const exp1 = useJsVsReactExperiment();
  const exp2 = useRenderVisualizerExperiment();
  const exp3 = useComponentExplorerExperiment();
  const exp4 = useStateBatchingExperiment();
  const exp5 = useEffectLifecycleExperiment();

  const map = {
    "js-vs-react": exp1,
    "render-visualizer": exp2,
    "component-explorer": exp3,
    "state-batching": exp4,
    "effect-lifecycle": exp5,
  };

  return map[activeId] || exp1;
}

export default function App() {
  const [activeId, setActiveId] = useState("js-vs-react");
  const [sessionKey, setSessionKey] = useState(0);

  // Keyboard shortcut Alt + 1..5 to jump between experiments
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.altKey) {
        const index = Number(e.key) - 1;
        if (EXPERIMENTS[index]) {
          setActiveId(EXPERIMENTS[index].id);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeExperimentMeta =
    EXPERIMENTS.find((item) => item.id === activeId) || EXPERIMENTS[0];

  return (
    <LabRunner
      key={`${activeId}-${sessionKey}`}
      activeId={activeId}
      onSelectExperiment={setActiveId}
      onResetExperiment={() => setSessionKey((k) => k + 1)}
      experimentMeta={activeExperimentMeta}
    />
  );
}

function LabRunner({
  activeId,
  onSelectExperiment,
  onResetExperiment,
  experimentMeta,
}) {
  const activeContent = ActiveLabSession({ activeId });

  const headerActions = (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--text-muted)",
        }}
      >
        Shortcut: Alt + 1–5
      </span>
      <button
        onClick={onResetExperiment}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "var(--radius-sm)",
          background: "var(--bg-surface-2)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-secondary)",
          fontSize: "11.5px",
        }}
        title="Reset current experiment state"
      >
        <RotateCcw size={12} /> Reset Lab State
      </button>
    </div>
  );

  return (
    <AppShell
      sidebar={
        <Sidebar
          experiments={EXPERIMENTS}
          activeId={activeId}
          onSelect={onSelectExperiment}
        />
      }
      headerActions={headerActions}
      experimentTitle={experimentMeta.title}
      experimentBadge={experimentMeta.badge}
      codePanel={activeContent.codePanel}
      previewPanel={
        <ErrorBoundary key={activeId}>
          {activeContent.previewPanel}
        </ErrorBoundary>
      }
      visualizerPanel={activeContent.visualizerPanel}
      explanationPanel={activeContent.explanationPanel}
    />
  );
}
