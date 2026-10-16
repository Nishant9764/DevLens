// src/components/layout/AppShell.jsx
import React from "react";
import styles from "./AppShell.module.css";

export function AppShell({
  sidebar,
  headerActions,
  experimentTitle,
  experimentBadge,
  codePanel,
  previewPanel,
  visualizerPanel,
  explanationPanel,
}) {
  return (
    <div className={styles.workspaceRoot}>
      {sidebar}

      <div className={styles.mainColumn}>
        <header className={styles.topBar}>
          <div className={styles.titleGroup}>
            <span className={styles.badge}>{experimentBadge}</span>
            <h1 className={styles.title}>{experimentTitle}</h1>
          </div>
          <div className={styles.headerControls}>{headerActions}</div>
        </header>

        <main className={styles.labGrid}>
          {/* Left Pane: Code & Controls */}
          <section className={styles.paneCode}>
            <div className={styles.paneHeader}>
              <span className={styles.paneLabel}>SOURCE & PARAMETERS</span>
            </div>
            <div className={styles.paneBody}>{codePanel}</div>
          </section>

          {/* Top Right Pane: Isolated Live Preview */}
          <section className={styles.panePreview}>
            <div className={styles.paneHeader}>
              <span className={styles.paneLabel}>LIVE EXECUTION PREVIEW</span>
            </div>
            <div className={styles.paneBody}>{previewPanel}</div>
          </section>

          {/* Middle Right Pane: Execution & Reconciliation Visualizer */}
          <section className={styles.paneVisualizer}>
            <div className={styles.paneHeader}>
              <span className={styles.paneLabel}>
                EXECUTION & RENDERING VISUALIZER
              </span>
            </div>
            <div className={styles.paneBody}>{visualizerPanel}</div>
          </section>

          {/* Bottom Right Pane: Contextual Explanation */}
          <section className={styles.paneExplanation}>
            <div className={styles.paneHeader}>
              <span className={styles.paneLabel}>WHAT HAPPENED & WHY</span>
            </div>
            <div className={styles.paneBody}>{explanationPanel}</div>
          </section>
        </main>
      </div>
    </div>
  );
}
