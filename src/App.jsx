// src/App.jsx
import React, { useState } from "react";
import { EXPERIMENTS } from "./experiments";
import { AppShell } from "./components/layout/AppShell";
import { Sidebar } from "./components/layout/Sidebar";
import { ErrorBoundary } from "./components/preview/ErrorBoundary";
import { useJsVsReactExperiment } from "./experiments/exp1-js-vs-react/JsVsReactExperiment";
import { useRenderVisualizerExperiment } from "./experiments/exp2-render-pipeline/RenderVisualizerExperiment";
import { useComponentExplorerExperiment } from "./experiments/exp3-component-explorer/ComponentExplorerExperiment";
import { useStateBatchingExperiment } from "./experiments/exp4-state-batching/StateBatchingExperiment";
import { useEffectLifecycleExperiment } from "./experiments/exp5-effect-lifecycle/EffectLifecycleExperiment";
import { InteractivePlayground } from "./playground/InteractivePlayground";
import { Sparkles, RotateCcw } from "lucide-react";
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
  // Default to the beginner-friendly gamified Visual Quest!
  const [viewMode, setViewMode] = useState("quest"); // 'quest' | 'lab'
  const [activeId, setActiveId] = useState("js-vs-react");
  const [sessionKey, setSessionKey] = useState(0);

  if (viewMode === "quest") {
    return (
      <InteractivePlayground onSwitchToProMode={() => setViewMode("lab")} />
    );
  }

  const activeExperimentMeta =
    EXPERIMENTS.find((item) => item.id === activeId) || EXPERIMENTS[0];

  return (
    <LabRunner
      key={`${activeId}-${sessionKey}`}
      activeId={activeId}
      onSelectExperiment={setActiveId}
      onResetExperiment={() => setSessionKey((k) => k + 1)}
      onSwitchToQuest={() => setViewMode("quest")}
      experimentMeta={activeExperimentMeta}
    />
  );
}

function LabRunner({
  activeId,
  onSelectExperiment,
  onResetExperiment,
  onSwitchToQuest,
  experimentMeta,
}) {
  const activeContent = ActiveLabSession({ activeId });

  const headerActions = (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <button
        onClick={onSwitchToQuest}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "var(--radius-sm)",
          background: "var(--accent-react-dim)",
          border: "1px solid var(--accent-react)",
          color: "var(--accent-react)",
          fontSize: "11.5px",
          fontWeight: 600,
        }}
      >
        <Sparkles size={13} /> Back to Visual Quest Mode
      </button>
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
      >
        <RotateCcw size={12} /> Reset
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
