// src/experiments/exp3-component-explorer/ComponentExplorerExperiment.jsx
import React, { useState } from "react";
import { CodePanel } from "../../components/editor/CodePanel";
import { GitBranch, ArrowDown } from "lucide-react";
import styles from "./ComponentExplorerExperiment.module.css";

// Actual Child Component rendered inside the Live Preview
function MemberBadge({ name, role, isOnline }) {
  return (
    <div className={styles.childBadgeCard}>
      <div className={styles.childTop}>
        <span className={styles.memberName}>{name}</span>
        <span className={isOnline ? styles.statusOnline : styles.statusOffline}>
          {isOnline ? "● Online" : "○ Offline"}
        </span>
      </div>
      <div className={styles.memberRole}>role="{role}"</div>
    </div>
  );
}

export function useComponentExplorerExperiment() {
  const [leadRole, setLeadRole] = useState("Systems Architect");
  const [leadOnline, setLeadOnline] = useState(true);
  const [lastChangedProp, setLastChangedProp] = useState("role");

  const updateRole = (newRole) => {
    setLeadRole(newRole);
    setLastChangedProp("role");
  };

  const toggleOnline = () => {
    setLeadOnline((v) => !v);
    setLastChangedProp("isOnline");
  };

  const code = `// Reusable Child Component receives "props" object
function MemberBadge({ name, role, isOnline }) {
  return (
    <div className="badge-card">
      <strong>{name}</strong>
      <span>{isOnline ? "Online" : "Offline"}</span>
      <p>Role: {role}</p>
    </div>
  );
}

// Parent Component owns state and passes props down
function TeamPanel() {
  return (
    <section>
      <MemberBadge
        name="Aria Chen"
        role="${leadRole}"
        isOnline={${leadOnline}}
      />
      <MemberBadge
        name="Liam Patel"
        role="UI Engineer"
        isOnline={true}
      />
    </section>
  );
}`;

  const activeLines =
    lastChangedProp === "role" ? [2, 6, 16, 18] : [2, 5, 16, 19];

  const controls = (
    <div className={styles.propControls}>
      <div className={styles.controlCluster}>
        <span className={styles.propLabel}>
          Prop <code>role</code> (Child #1):
        </span>
        {["Systems Architect", "React Core Dev", "Product Designer"].map(
          (r) => (
            <button
              key={r}
              onClick={() => updateRole(r)}
              className={`${styles.propBtn} ${
                leadRole === r ? styles.propBtnActive : ""
              }`}
            >
              "{r}"
            </button>
          )
        )}
      </div>

      <div className={styles.controlCluster}>
        <span className={styles.propLabel}>
          Prop <code>isOnline</code> (Child #1):
        </span>
        <button onClick={toggleOnline} className={styles.propBtnActive}>
          {String(leadOnline)} (Click to toggle)
        </button>
      </div>
    </div>
  );

  const codePanel = (
    <CodePanel
      code={code}
      activeLines={activeLines}
      controls={controls}
      fileLabel="TeamComposition.jsx"
    />
  );

  const previewPanel = (
    <div className={styles.parentPreviewBox}>
      <div className={styles.parentBoundaryLabel}>
        &lt;TeamPanel&gt; (Parent Component)
      </div>
      <div className={styles.childrenGrid}>
        <MemberBadge name="Aria Chen" role={leadRole} isOnline={leadOnline} />
        <MemberBadge name="Liam Patel" role="UI Engineer" isOnline={true} />
      </div>
    </div>
  );

  const visualizerPanel = (
    <div className={styles.treeFlowContainer}>
      <div className={styles.parentNode}>
        <GitBranch size={14} />
        <span>
          Parent: <strong>&lt;TeamPanel /&gt;</strong>
        </span>
        <span className={styles.flowHint}>
          One-Way Data Flow (Props Pass Down)
        </span>
      </div>

      <div className={styles.branchesRow}>
        {/* Child 1 Branch */}
        <div className={`${styles.childBranch} ${styles.branchUpdated}`}>
          <div className={styles.propPipe}>
            <ArrowDown size={13} />
            <code>
              props = &#123; name: "Aria Chen", role: "{leadRole}", isOnline:{" "}
              {String(leadOnline)} &#125;
            </code>
          </div>
          <div className={styles.childNodeBox}>
            <div className={styles.nodeTitle}>
              &lt;MemberBadge /&gt; #1{" "}
              <span className={styles.rerenderTag}>Updated via Props</span>
            </div>
            <div className={styles.nodeSub}>
              Changed prop: <code>{lastChangedProp}</code>
            </div>
          </div>
        </div>

        {/* Child 2 Branch */}
        <div className={styles.childBranch}>
          <div className={styles.propPipe}>
            <ArrowDown size={13} />
            <code>
              props = &#123; name: "Liam Patel", role: "UI Engineer", isOnline:
              true &#125;
            </code>
          </div>
          <div className={styles.childNodeBox}>
            <div className={styles.nodeTitle}>
              &lt;MemberBadge /&gt; #2{" "}
              <span className={styles.staticTag}>Props Unchanged</span>
            </div>
            <div className={styles.nodeSub}>
              Same component definition, independent prop inputs
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const explanationPanel = (
    <div className={styles.compExplanation}>
      <div>
        <h4>Component Composition & One-Way Data Flow</h4>
        <p>
          Components let you split UI into independent, reusable pieces. Here,{" "}
          <code>TeamPanel</code> renders two instances of{" "}
          <code>MemberBadge</code>. Even though both instances share the exact
          same function definition, each receives its own <strong>props</strong>{" "}
          object. When you change Aria's <code>{lastChangedProp}</code> prop in
          the parent, data flows strictly downward from <code>TeamPanel</code>{" "}
          into <code>MemberBadge #1</code>, updating Aria's output while Liam's
          badge remains unaffected.
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
