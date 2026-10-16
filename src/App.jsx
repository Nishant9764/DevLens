// src/App.jsx
import React, { useState } from "react";
import { EXPERIMENTS } from "./experiments";
import { AppShell } from "./components/layout/AppShell";
import { Sidebar } from "./components/layout/Sidebar";
import { ErrorBoundary } from "./components/preview/ErrorBoundary";
import { useJsVsReactExperiment } from "./experiments/exp1-js-vs-react/JsVsReactExperiment";
import { useRenderVisualizerExperiment } from "./experiments/exp2-render-pipeline/RenderVisualizerExperiment";
import { useComponentExplorerExperiment } from "./experiments/exp3-component-explorer/ComponentExplorerExperiment";
import "./styles/global.css";

export default function App() {
  const [activeId, setActiveId] = useState("js-vs-react");

  const exp1 = useJsVsReactExperiment();
  const exp2 = useRenderVisualizerExperiment();
  const exp3 = useComponentExplorerExperiment();

  const activeExperimentMeta =
    EXPERIMENTS.find((item) => item.id === activeId) || EXPERIMENTS[0];

  const activeContent =
    activeId === "js-vs-react"
      ? exp1
      : activeId === "render-visualizer"
      ? exp2
      : exp3;

  return (
    <AppShell
      sidebar={
        <Sidebar
          experiments={EXPERIMENTS}
          activeId={activeId}
          onSelect={setActiveId}
        />
      }
      experimentTitle={activeExperimentMeta.title}
      experimentBadge={activeExperimentMeta.badge}
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
