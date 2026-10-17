// src/experiments/exp4-state-batching/StateBatchingExperiment.jsx
import React, { useState } from "react";
import { CodePanel } from "../../components/editor/CodePanel";
import { Layers, RotateCcw, ArrowRight } from "lucide-react";
import styles from "./StateBatchingExperiment.module.css";

export function useStateBatchingExperiment() {
  const [strategy, setStrategy] = useState("snapshot"); // 'snapshot' | 'updater'
  const [score, setScore] = useState(0);
  const [renderCount, setRenderCount] = useState(1);
  const [queueTrace, setQueueTrace] = useState(null);

  const runTripleUpdate = () => {
    const startScore = score;

    if (strategy === "snapshot") {
      // Genuine React behavior: 3 calls referencing the same render snapshot
      setScore(score + 1);
      setScore(score + 1);
      setScore(score + 1);
      setRenderCount((r) => r + 1);

      setQueueTrace({
        mode: "snapshot",
        snapshotVal: startScore,
        finalVal: startScore + 1,
        ops: [
          {
            call: `setScore(${startScore} + 1)`,
            input: startScore,
            output: startScore + 1,
          },
          {
            call: `setScore(${startScore} + 1)`,
            input: startScore,
            output: startScore + 1,
          },
          {
            call: `setScore(${startScore} + 1)`,
            input: startScore,
            output: startScore + 1,
          },
        ],
      });
    } else {
      // Genuine React updater queue behavior
      setScore((n) => n + 1);
      setScore((n) => n + 1);
      setScore((n) => n + 1);
      setRenderCount((r) => r + 1);

      setQueueTrace({
        mode: "updater",
        snapshotVal: startScore,
        finalVal: startScore + 3,
        ops: [
          { call: "n => n + 1", input: startScore, output: startScore + 1 },
          { call: "n => n + 1", input: startScore + 1, output: startScore + 2 },
          { call: "n => n + 1", input: startScore + 2, output: startScore + 3 },
        ],
      });
    }
  };

  const resetLab = () => {
    setScore(0);
    setRenderCount(1);
    setQueueTrace(null);
  };

  const snapshotCode = `function Scoreboard() {
  // In this render snapshot, score is fixed at ${score}
  const [score, setScore] = useState(${score});

  function handleTripleClick() {
    // Each line reads the SAME snapshot (score = ${score}):
    setScore(score + 1); // Queues: replace with ${score + 1}
    setScore(score + 1); // Queues: replace with ${score + 1}
    setScore(score + 1); // Queues: replace with ${score + 1}
  }

  return <button onClick={handleTripleClick}>+3 ({score})</button>;
}`;

  const updaterCode = `function Scoreboard() {
  const [score, setScore] = useState(${score});

  function handleTripleClick() {
    // Updater functions receive the queued pending state (n):
    setScore(n => n + 1); // ${score} => ${score + 1}
    setScore(n => n + 1); // ${score + 1} => ${score + 2}
    setScore(n => n + 1); // ${score + 2} => ${score + 3}
  }

  return <button onClick={handleTripleClick}>+3 ({score})</button>;
}`;

  const controls = (
    <div className={styles.controlBar}>
      <span className={styles.label}>Update Strategy:</span>
      <button
        onClick={() => setStrategy("snapshot")}
        className={`${styles.modeBtn} ${
          strategy === "snapshot" ? styles.activeWarn : ""
        }`}
      >
        Direct Value: setScore(score + 1) × 3
      </button>
      <button
        onClick={() => setStrategy("updater")}
        className={`${styles.modeBtn} ${
          strategy === "updater" ? styles.activeSuccess : ""
        }`}
      >
        Updater Function: setScore(n =&gt; n + 1) × 3
      </button>
    </div>
  );

  const codePanel = (
    <CodePanel
      code={strategy === "snapshot" ? snapshotCode : updaterCode}
      activeLines={queueTrace ? [6, 7, 8, 9] : [2, 3]}
      controls={controls}
      fileLabel="ScoreBatching.jsx"
      accent={strategy === "snapshot" ? "js" : "react"}
    />
  );

  const previewPanel = (
    <div className={styles.previewWrap}>
      <div className={styles.scoreCard}>
        <div className={styles.scoreHeader}>
          <span className={styles.snapshotBadge}>
            Current Render Snapshot: <code>score = {score}</code>
          </span>
          <span className={styles.renderBadge}>
            Total Renders: <strong>{renderCount}</strong> (Batched!)
          </span>
        </div>

        <div className={styles.bigScoreDisplay}>
          <span className={styles.scoreNumber}>{score}</span>
          <span className={styles.scoreCaption}>
            {strategy === "snapshot"
              ? "Clicking below runs 3 setScore(score + 1) calls, but only adds +1"
              : "Clicking below pipes the pending value through all 3 updater functions (+3)"}
          </span>
        </div>

        <div className={styles.actionRow}>
          <button onClick={runTripleUpdate} className={styles.triggerBtn}>
            <Layers size={14} /> Run handleTripleClick() (3 Queued Updates)
          </button>
          <button onClick={resetLab} className={styles.resetBtn}>
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>
    </div>
  );

  const visualizerPanel = (
    <div className={styles.queueVisualizer}>
      {!queueTrace ? (
        <div className={styles.emptyState}>
          Click <strong>Run handleTripleClick()</strong> above to inspect how
          React processes its internal state update queue before triggering a
          single batched re-render.
        </div>
      ) : (
        <>
          <div className={styles.queueHeader}>
            <span>
              REACT STATE UPDATE QUEUE (Snapshot at click time:{" "}
              <code>score = {queueTrace.snapshotVal}</code>)
            </span>
            <span className={styles.batchTag}>
              3 Calls → 1 Batched Re-render
            </span>
          </div>

          <div className={styles.queueSteps}>
            {queueTrace.ops.map((op, index) => (
              <React.Fragment key={index}>
                <div className={styles.queueItem}>
                  <div className={styles.qIndex}>Queue Call #{index + 1}</div>
                  <code className={styles.qCode}>{op.call}</code>
                  <div className={styles.qResult}>
                    Input: <strong>{op.input}</strong> → Pending State:{" "}
                    <strong>{op.output}</strong>
                  </div>
                </div>
                {index < 2 && (
                  <ArrowRight size={15} className={styles.qArrow} />
                )}
              </React.Fragment>
            ))}
            <ArrowRight size={15} className={styles.qArrow} />
            <div className={styles.finalCommitBox}>
              <div className={styles.qIndex}>Next Render State</div>
              <div className={styles.finalNumber}>
                score = {queueTrace.finalVal}
              </div>
              <span className={styles.commitSub}>
                {queueTrace.mode === "snapshot"
                  ? "Overwrote 3 times with the same value!"
                  : "Accumulated all 3 updates cleanly!"}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const explanationPanel = (
    <div className={styles.explanationCols}>
      <div>
        <h4>Why State Behaves Like a Snapshot</h4>
        <p>
          Setting state does <strong>not</strong> mutate the <code>score</code>{" "}
          variable inside the currently running event handler. When{" "}
          <code>handleTripleClick</code> runs during a render where{" "}
          <code>score</code> is{" "}
          <code>{queueTrace ? queueTrace.snapshotVal : score}</code>, calling{" "}
          <code>setScore(score + 1)</code> three times literally executes{" "}
          <code>
            setScore({(queueTrace ? queueTrace.snapshotVal : score) + 1})
          </code>{" "}
          three times.
        </p>
      </div>
      <div>
        <h4>Automatic Batching & Updater Functions</h4>
        <p>
          React waits until <em>all</em> code inside your event handler finishes
          before re-rendering once (<strong>Batching</strong>). When you pass an
          updater function (<code>n =&gt; n + 1</code>), React puts your
          function in a queue and passes the return value of each queued
          function as <code>n</code> to the next one.
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
