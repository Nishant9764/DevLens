// src/experiments/exp2-render-pipeline/RenderVisualizerExperiment.jsx
import React, { useState } from "react";
import { CodePanel } from "../../components/editor/CodePanel";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import styles from "./RenderVisualizerExperiment.module.css";

const PIPELINE_STEPS = [
  {
    step: 1,
    name: "1. UI Interaction",
    short: "User Event",
    lines: [12, 13, 14],
    getDetail: (snap) =>
      `The user clicked the button in the browser. The browser dispatches a click event which React's SyntheticEvent system routes to the onClick prop.`,
  },
  {
    step: 2,
    name: "2. Event Handler Executes",
    short: "Handler Runs",
    lines: [4, 5, 6],
    getDetail: (snap) =>
      `handleUpgrade() runs and calls setLevel(${snap.nextLevel}). Calling setState does NOT immediately change the variable on the next line—it queues a state update with React.`,
  },
  {
    step: 3,
    name: "3. State Queued by React",
    short: "State Updated",
    lines: [2],
    getDetail: (snap) =>
      `React processes the queued state update, transitioning its internal Hook slot from ${snap.prevLevel} to ${snap.nextLevel}, and schedules a component re-render.`,
  },
  {
    step: 4,
    name: "4. Component Renders",
    short: "Render Phase",
    lines: [1, 2, 8, 9, 10, 11],
    getDetail: (snap) =>
      `React calls StatusCard() again. "Rendering" in React purely means calling your component function to return a fresh tree of React Elements (lightweight JS objects) describing the UI for level = ${snap.nextLevel}.`,
  },
  {
    step: 5,
    name: "5. Reconciliation (Diffing)",
    short: "Reconcile Trees",
    lines: [9, 10, 11],
    getDetail: (snap) =>
      `React compares the Previous React Element Tree in memory (level: ${snap.prevLevel}) against the New React Element Tree (level: ${snap.nextLevel}). It sees <div className="card"> and <h3> did NOT change—only the text inside <span className="badge"> changed.`,
  },
  {
    step: 6,
    name: "6. Browser DOM Commit",
    short: "Commit Phase",
    lines: [11],
    getDetail: (snap) =>
      `React applies the minimal DOM mutation: it leaves the outer <div>, <h3>, and <button> untouched, updating only span.badge's textContent to "Level ${snap.nextLevel}". The browser repaints.`,
  },
];

export function useRenderVisualizerExperiment() {
  const [level, setLevel] = useState(1);
  const [activeStage, setActiveStage] = useState(5); // 0-indexed (0..5)
  const [snapshot, setSnapshot] = useState({
    prevLevel: 0,
    nextLevel: 1,
    renderId: 1,
  });

  const triggerUpdate = (delta) => {
    const prev = level;
    const next = delta === 0 ? 1 : prev + delta;
    setLevel(next);
    setSnapshot((s) => ({
      prevLevel: prev,
      nextLevel: next,
      renderId: s.renderId + 1,
    }));
    setActiveStage(0); // Start at Step 1 so user can step through or inspect immediately
  };

  const currentStepInfo = PIPELINE_STEPS[activeStage];

  const code = `function StatusCard() {
  const [level, setLevel] = useState(${level});

  function handleUpgrade() {
    setLevel(level + 1);
  }

  return (
    <div className="card">
      <h3>Engine Core</h3>
      <span className="badge">Level {level}</span>
      <button onClick={handleUpgrade}>
        Upgrade (+1)
      </button>
    </div>
  );
}`;

  const codePanel = (
    <CodePanel
      code={code}
      activeLines={currentStepInfo.lines}
      fileLabel="StatusCard.jsx"
      controls={
        <div className={styles.stepperControls}>
          <span className={styles.stepIndicator}>
            Inspecting Step {currentStepInfo.step} of 6:{" "}
            <strong>{currentStepInfo.short}</strong>
          </span>
          <div className={styles.navButtons}>
            <button
              onClick={() => setActiveStage((s) => Math.max(0, s - 1))}
              disabled={activeStage === 0}
              className={styles.stepBtn}
            >
              <ChevronLeft size={14} /> Prev Step
            </button>
            <button
              onClick={() =>
                setActiveStage((s) =>
                  Math.min(PIPELINE_STEPS.length - 1, s + 1)
                )
              }
              disabled={activeStage === PIPELINE_STEPS.length - 1}
              className={styles.stepBtnPrimary}
            >
              Next Step <ChevronRight size={14} />
            </button>
          </div>
        </div>
      }
    />
  );

  const previewPanel = (
    <div className={styles.previewContainer}>
      <div className={styles.liveCard}>
        <div className={styles.cardTop}>
          <span className={styles.staticNodeTag}>Unchanged DOM Node</span>
          <h3 className={styles.cardHeading}>Engine Core</h3>
        </div>

        <div className={styles.badgeWrapper}>
          <span key={level} className={styles.levelBadge}>
            Level {level}
          </span>
          <span className={styles.mutatedNodeTag}>
            ← Only this text node updates on commit
          </span>
        </div>

        <div className={styles.previewActions}>
          <button
            onClick={() => triggerUpdate(1)}
            className={styles.upgradeBtn}
          >
            <Sparkles size={14} /> Upgrade (+1) & Trace Render
          </button>
          <button onClick={() => triggerUpdate(0)} className={styles.resetBtn}>
            Reset to 1
          </button>
        </div>
      </div>

      <div className={styles.telemetrySummary}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Render Cycle</span>
          <span className={styles.statValue}>#{snapshot.renderId}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Previous State</span>
          <span className={styles.statValue}>level: {snapshot.prevLevel}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Committed State</span>
          <span className={styles.statValueAccent}>
            level: {snapshot.nextLevel}
          </span>
        </div>
      </div>
    </div>
  );

  const visualizerPanel = (
    <div className={styles.visualizerLayout}>
      {/* 6-Step Interactive Timeline Bar */}
      <div className={styles.stepsStrip}>
        {PIPELINE_STEPS.map((s, idx) => {
          const isCurrent = idx === activeStage;
          const isCompleted = idx < activeStage;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStage(idx)}
              className={`${styles.stageTab} ${
                isCurrent ? styles.stageCurrent : ""
              } ${isCompleted ? styles.stageDone : ""}`}
            >
              <span className={styles.stageIdx}>{s.step}</span>
              <span className={styles.stageLabel}>{s.short}</span>
            </button>
          );
        })}
      </div>

      {/* Tree Diff / Execution Inspector */}
      <div className={styles.treesComparison}>
        <div className={styles.treeBox}>
          <div className={styles.treeHeader}>
            Previous Element Tree in Memory (Render #
            {Math.max(1, snapshot.renderId - 1)})
          </div>
          <div className={styles.treeNodes}>
            <div className={styles.nodeLine}>&lt;div className="card"&gt;</div>
            <div className={styles.nodeLineIndent}>
              &lt;h3&gt;"Engine Core"&lt;/h3&gt;
            </div>
            <div className={`${styles.nodeLineIndent} ${styles.nodeOld}`}>
              &lt;span className="badge"&gt;"Level {snapshot.prevLevel}
              "&lt;/span&gt;
            </div>
            <div className={styles.nodeLineIndent}>
              &lt;button&gt;"Upgrade (+1)"&lt;/button&gt;
            </div>
          </div>
        </div>

        <div className={styles.treeBox}>
          <div className={styles.treeHeader}>
            New Element Tree & Reconciliation Verdict (Render #
            {snapshot.renderId})
          </div>
          <div className={styles.treeNodes}>
            <div className={styles.nodeLine}>
              &lt;div className="card"&gt;{" "}
              <span className={styles.keepBadge}>Reuse DOM</span>
            </div>
            <div className={styles.nodeLineIndent}>
              &lt;h3&gt;"Engine Core"&lt;/h3&gt;{" "}
              <span className={styles.keepBadge}>Reuse DOM</span>
            </div>
            <div className={`${styles.nodeLineIndent} ${styles.nodeDiff}`}>
              &lt;span className="badge"&gt;"Level {snapshot.nextLevel}
              "&lt;/span&gt;{" "}
              <span className={styles.patchBadge}>PATCH textContent</span>
            </div>
            <div className={styles.nodeLineIndent}>
              &lt;button&gt;"Upgrade (+1)"&lt;/button&gt;{" "}
              <span className={styles.keepBadge}>Reuse DOM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const explanationPanel = (
    <div className={styles.stageExplanation}>
      <div className={styles.stageTitleRow}>
        <CheckCircle2 size={16} className={styles.stageIcon} />
        <h4>{currentStepInfo.name}</h4>
      </div>
      <p className={styles.stageDetailText}>
        {currentStepInfo.getDetail(snapshot)}
      </p>
      <div className={styles.accuracyNote}>
        <strong>Technical Accuracy Note:</strong> Rendering is <em>not</em>{" "}
        updating the browser DOM. A component can render without changing the
        DOM if its returned React Elements match the previous render.
        Furthermore, the "Virtual DOM" is not a copy of the browser DOM—it is
        simply the lightweight tree of JavaScript objects returned by your
        component functions.
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
