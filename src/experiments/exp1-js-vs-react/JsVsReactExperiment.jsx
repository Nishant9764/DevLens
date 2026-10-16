// src/experiments/exp1-js-vs-react/JsVsReactExperiment.jsx
import React, { useState, useRef, useEffect } from "react";
import { CodePanel } from "../../components/editor/CodePanel";
import { Play, RotateCcw, ArrowRight, Zap } from "lucide-react";
import styles from "./JsVsReactExperiment.module.css";

export function useJsVsReactExperiment() {
  const [mode, setMode] = useState("comparison"); // 'vanilla' | 'react' | 'comparison'
  const [stepSize, setStepSize] = useState(1);

  // React Counter State
  const [reactCount, setReactCount] = useState(0);
  const [reactRenderCount, setReactRenderCount] = useState(1);

  // Vanilla JS Counter Ref & Tracker (for telemetry synchronization)
  const vanillaDomRef = useRef(null);
  const vanillaInternalCount = useRef(0);
  const [vanillaMutations, setVanillaMutations] = useState(0);

  // Shared Execution Log
  const [lastEvent, setLastEvent] = useState({
    engine: "none",
    action: "init",
    prevValue: 0,
    nextValue: 0,
    activeLines: [],
  });

  // Real imperative DOM manipulation for Vanilla JS counter
  const handleVanillaIncrement = () => {
    const prev = vanillaInternalCount.current;
    const next = prev + stepSize;
    vanillaInternalCount.current = next;

    // Genuine imperative DOM query + mutation inside the isolated preview
    if (vanillaDomRef.current) {
      const valueEl = vanillaDomRef.current.querySelector(
        "[data-vanilla-count]"
      );
      if (valueEl) {
        valueEl.textContent = String(next);
        valueEl.classList.remove(styles.flashJs);
        void valueEl.offsetWidth; // trigger reflow for flash animation
        valueEl.classList.add(styles.flashJs);
      }
    }

    setVanillaMutations((m) => m + 1);
    setLastEvent({
      engine: "vanilla",
      action: `Increment (+${stepSize})`,
      prevValue: prev,
      nextValue: next,
      activeLines: [6, 7, 8],
    });
  };

  const handleVanillaReset = () => {
    const prev = vanillaInternalCount.current;
    vanillaInternalCount.current = 0;
    if (vanillaDomRef.current) {
      const valueEl = vanillaDomRef.current.querySelector(
        "[data-vanilla-count]"
      );
      if (valueEl) valueEl.textContent = "0";
    }
    setVanillaMutations((m) => m + 1);
    setLastEvent({
      engine: "vanilla",
      action: "Reset to 0",
      prevValue: prev,
      nextValue: 0,
      activeLines: [12, 13],
    });
  };

  // Declarative state update for React counter
  const handleReactIncrement = () => {
    const prev = reactCount;
    const next = prev + stepSize;
    setReactCount(next);
    setReactRenderCount((r) => r + 1);
    setLastEvent({
      engine: "react",
      action: `setCount(${prev} + ${stepSize})`,
      prevValue: prev,
      nextValue: next,
      activeLines: [2, 5, 9],
    });
  };

  const handleReactReset = () => {
    const prev = reactCount;
    setReactCount(0);
    setReactRenderCount((r) => r + 1);
    setLastEvent({
      engine: "react",
      action: "setCount(0)",
      prevValue: prev,
      nextValue: 0,
      activeLines: [2, 6, 9],
    });
  };

  // Ensure vanilla DOM stays synced if stepSize or mode switches
  useEffect(() => {
    if (vanillaDomRef.current) {
      const valueEl = vanillaDomRef.current.querySelector(
        "[data-vanilla-count]"
      );
      if (valueEl) valueEl.textContent = String(vanillaInternalCount.current);
    }
  }, [mode]);

  const vanillaCode = `// 1. Imperative Vanilla JavaScript
let count = 0;
const countEl = document.querySelector('#count-value');

function increment() {
  count = count + ${stepSize};
  // You must manually locate and mutate the exact DOM node:
  countEl.textContent = count;
}

function reset() {
  count = 0;
  countEl.textContent = 0;
}`;

  const reactCode = `// 2. Declarative React Component
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + ${stepSize});
  const reset = () => setCount(0);

  // You describe WHAT the UI should look like for the current state:
  return <span className="value">{count}</span>;
}`;

  const combinedCode = `${vanillaCode}\n\n${reactCode}`;

  const controls = (
    <>
      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>View Code:</span>
        {["comparison", "vanilla", "react"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`${styles.pillBtn} ${
              mode === m ? styles.pillActive : ""
            }`}
          >
            {m === "comparison"
              ? "Both Side-by-Side"
              : m === "vanilla"
              ? "Vanilla JS"
              : "React JSX"}
          </button>
        ))}
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Step Increment:</span>
        {[1, 5, 10].map((step) => (
          <button
            key={step}
            onClick={() => setStepSize(step)}
            className={`${styles.pillBtn} ${
              stepSize === step ? styles.pillActive : ""
            }`}
          >
            +{step}
          </button>
        ))}
      </div>
    </>
  );

  const codePanel = (
    <CodePanel
      code={
        mode === "vanilla"
          ? vanillaCode
          : mode === "react"
          ? reactCode
          : combinedCode
      }
      activeLines={
        mode === "comparison"
          ? lastEvent.engine === "react"
            ? lastEvent.activeLines.map((l) => l + 16)
            : lastEvent.activeLines
          : lastEvent.activeLines
      }
      controls={controls}
      fileLabel={
        mode === "vanilla"
          ? "vanilla-counter.js"
          : mode === "react"
          ? "ReactCounter.jsx"
          : "comparison.jsx"
      }
      accent={lastEvent.engine === "vanilla" ? "js" : "react"}
    />
  );

  const previewPanel = (
    <div className={styles.previewGrid}>
      {/* Vanilla JS Interactive Card */}
      <div className={styles.counterCard} ref={vanillaDomRef}>
        <div className={styles.cardHeader}>
          <span className={styles.tagJs}>Vanilla JS (Imperative)</span>
          <span className={styles.metaStat}>
            DOM writes: {vanillaMutations}
          </span>
        </div>

        <div className={styles.counterDisplay}>
          <span className={styles.domNodeLabel}>#count-value.textContent</span>
          <div data-vanilla-count className={styles.countNumber}>
            0
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button onClick={handleVanillaIncrement} className={styles.btnJs}>
            <Play size={13} /> Increment (+{stepSize})
          </button>
          <button onClick={handleVanillaReset} className={styles.btnSecondary}>
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* React Interactive Card */}
      <div className={styles.counterCard}>
        <div className={styles.cardHeader}>
          <span className={styles.tagReact}>React (Declarative)</span>
          <span className={styles.metaStat}>
            Component renders: {reactRenderCount}
          </span>
        </div>

        <div className={styles.counterDisplay}>
          <span className={styles.domNodeLabel}>
            State: count = {reactCount}
          </span>
          <div
            key={reactCount}
            className={`${styles.countNumber} ${styles.flashReact}`}
          >
            {reactCount}
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button onClick={handleReactIncrement} className={styles.btnReact}>
            <Zap size={13} /> setCount(count + {stepSize})
          </button>
          <button onClick={handleReactReset} className={styles.btnSecondary}>
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>
    </div>
  );

  const visualizerPanel = (
    <div className={styles.visualizerWrap}>
      {lastEvent.engine === "none" ? (
        <div className={styles.emptyPrompt}>
          Interact with either the <strong>Vanilla JS</strong> or{" "}
          <strong>React</strong> counter above to inspect the live execution
          path.
        </div>
      ) : lastEvent.engine === "vanilla" ? (
        <div className={styles.pipelineTrack}>
          <div className={styles.pipelineHeader}>
            <span className={styles.tagJs}>IMPERATIVE EXECUTION TRACE</span>
            <span className={styles.traceAction}>{lastEvent.action}</span>
          </div>
          <div className={styles.flowRow}>
            <div className={styles.flowStep}>
              <div className={styles.stepNum}>1. Event Fired</div>
              <div className={styles.stepTitle}>Click Handler Runs</div>
              <code>
                count = {lastEvent.prevValue} → {lastEvent.nextValue}
              </code>
            </div>
            <ArrowRight size={16} className={styles.arrow} />
            <div className={styles.flowStep}>
              <div className={styles.stepNum}>2. Manual Lookup</div>
              <div className={styles.stepTitle}>Target DOM Element</div>
              <code>document.querySelector('[data-vanilla-count]')</code>
            </div>
            <ArrowRight size={16} className={styles.arrow} />
            <div className={`${styles.flowStep} ${styles.stepHighlightJs}`}>
              <div className={styles.stepNum}>3. Direct Mutation</div>
              <div className={styles.stepTitle}>Overwrite DOM Property</div>
              <code>element.textContent = "{lastEvent.nextValue}"</code>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.pipelineTrack}>
          <div className={styles.pipelineHeader}>
            <span className={styles.tagReact}>DECLARATIVE REACT PIPELINE</span>
            <span className={styles.traceAction}>{lastEvent.action}</span>
          </div>
          <div className={styles.flowRow}>
            <div className={styles.flowStep}>
              <div className={styles.stepNum}>1. State Update</div>
              <div className={styles.stepTitle}>Schedule State Transition</div>
              <code>
                state: {lastEvent.prevValue} → {lastEvent.nextValue}
              </code>
            </div>
            <ArrowRight size={16} className={styles.arrow} />
            <div className={styles.flowStep}>
              <div className={styles.stepNum}>2. Render Component</div>
              <div className={styles.stepTitle}>
                Call Counter() with new state
              </div>
              <code>return &lt;div&gt;{lastEvent.nextValue}&lt;/div&gt;</code>
            </div>
            <ArrowRight size={16} className={styles.arrow} />
            <div className={`${styles.flowStep} ${styles.stepHighlightReact}`}>
              <div className={styles.stepNum}>3. Reconcile & Commit</div>
              <div className={styles.stepTitle}>
                Diff trees & patch text node
              </div>
              <code>
                Old: "{lastEvent.prevValue}" !== New: "{lastEvent.nextValue}"
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const explanationPanel = (
    <div className={styles.explanationGrid}>
      <div className={styles.expBlock}>
        <h4>How Vanilla JavaScript Updated the UI</h4>
        <p>
          In imperative JavaScript, your code is responsible for{" "}
          <strong>both</strong> updating the variable in memory (
          <code>count = {vanillaInternalCount.current}</code>) and manually
          locating the exact DOM node (<code>countEl.textContent = count</code>)
          to overwrite it. As an application grows to dozens of UI elements
          depending on the same data, forgetting a single manual DOM update
          causes out-of-sync UI bugs.
        </p>
      </div>
      <div className={styles.expBlock}>
        <h4>How React Updated the UI</h4>
        <p>
          In React, you never touch <code>element.textContent</code>. You call{" "}
          <code>setCount({reactCount})</code> to update state. React
          automatically calls your <code>Counter()</code> component function
          again, compares the returned UI description against the previous
          render in memory, and surgically updates the changed text node in the
          browser DOM.
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
