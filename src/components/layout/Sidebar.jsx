// src/components/layout/Sidebar.jsx
import React from "react";
import {
  FlaskConical,
  Cpu,
  Layers,
  Code2,
  Boxes,
  Activity,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const ICONS = {
  "js-vs-react": Code2,
  "render-visualizer": Cpu,
  "component-explorer": Layers,
  "state-batching": Boxes,
  "effect-lifecycle": Activity,
};

export function Sidebar({ experiments, activeId, onSelect }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logoMark}>
          <FlaskConical size={16} />
        </div>
        <div>
          <span className={styles.brandName}>DevLens</span>
          <span className={styles.brandTag}>React Lab</span>
        </div>
      </div>

      <div className={styles.sectionHeader}>EXPERIMENTS</div>

      <nav className={styles.navList}>
        {experiments.map((exp) => {
          const Icon = ICONS[exp.id] || FlaskConical;
          const isActive = exp.id === activeId;
          return (
            <button
              key={exp.id}
              onClick={() => onSelect(exp.id)}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <div className={styles.navTop}>
                <span className={styles.expNumber}>{exp.number}</span>
                <Icon size={14} className={styles.expIcon} />
                <span className={styles.expTitle}>{exp.title}</span>
              </div>
              <p className={styles.expSubtitle}>{exp.subtitle}</p>
            </button>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.telemetryStatus}>
          <span className={styles.statusDot} />
          <span>5 Modules Active</span>
        </div>
      </div>
    </aside>
  );
}
