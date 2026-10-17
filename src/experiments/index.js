// src/experiments/index.js
export const EXPERIMENTS = [
  {
    id: "js-vs-react",
    number: "01",
    title: "Imperative JS vs. React",
    subtitle: "Manual DOM mutation vs. declarative state",
    status: "ready",
    badge: "Core Concept",
  },
  {
    id: "render-visualizer",
    number: "02",
    title: "Rendering & Reconciliation",
    subtitle: "Step-by-step render pipeline & tree diffing",
    status: "ready",
    badge: "Visualizer",
  },
  {
    id: "component-explorer",
    number: "03",
    title: "Component Composition",
    subtitle: "Parent-child hierarchies and props data flow",
    status: "ready",
    badge: "Architecture",
  },
  {
    id: "state-batching",
    number: "04",
    title: "State as a Snapshot & Batching",
    subtitle: "Why 3 setCount(count + 1) calls only add 1",
    status: "ready",
    badge: "State Mechanics",
  },
  {
    id: "effect-lifecycle",
    number: "05",
    title: "useEffect & Cleanup Lifecycle",
    subtitle: "Dependency arrays, post-commit effects, and cleanup",
    status: "ready",
    badge: "Lifecycle",
  },
];
