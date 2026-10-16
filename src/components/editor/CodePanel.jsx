// src/components/editor/CodePanel.jsx
import React from "react";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import styles from "./CodePanel.module.css";

export function CodePanel({
  code,
  activeLines = [],
  controls,
  fileLabel = "Experiment.jsx",
  accent = "react",
}) {
  const lines = code.trim().split("\n");

  return (
    <div className={styles.editorContainer}>
      {controls && <div className={styles.controlsBar}>{controls}</div>}

      <div className={styles.fileTabBar}>
        <span
          className={`${styles.fileDot} ${
            accent === "js" ? styles.dotJs : styles.dotReact
          }`}
        />
        <span className={styles.fileName}>{fileLabel}</span>
        {activeLines.length > 0 && (
          <span className={styles.activeLineBadge}>
            Executing L{activeLines[0]}
            {activeLines.length > 1
              ? `–L${activeLines[activeLines.length - 1]}`
              : ""}
          </span>
        )}
      </div>

      <pre className={styles.codeBlock}>
        <code>
          {lines.map((lineText, idx) => {
            const lineNumber = idx + 1;
            const isHighlighted = activeLines.includes(lineNumber);
            const html = Prism.highlight(
              lineText || " ",
              Prism.languages.jsx || Prism.languages.javascript,
              "jsx"
            );

            return (
              <div
                key={lineNumber}
                className={`${styles.codeLine} ${
                  isHighlighted ? styles.lineActive : ""
                }`}
              >
                <span className={styles.lineNumber}>{lineNumber}</span>
                <span
                  className={styles.lineContent}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
