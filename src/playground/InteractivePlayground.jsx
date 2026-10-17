// src/playground/InteractivePlayground.jsx
import React, { useState } from "react";
import {
  Sparkles,
  Puzzle,
  Cpu,
  SearchCheck,
  HeartPulse,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Play,
  Trash2,
  Eye,
  Code,
} from "lucide-react";
import styles from "./InteractivePlayground.module.css";

const MISSIONS = [
  {
    id: 1,
    title: "1. What is React?",
    subtitle: "Drag & Drop LEGO UI Builder",
    icon: Puzzle,
  },
  {
    id: 2,
    title: "2. Code to HTML Machine",
    subtitle: "How JSX becomes HTML & CSS",
    icon: Cpu,
  },
  {
    id: 3,
    title: "3. Virtual DOM Game",
    subtitle: "Play as the Reconciler Robot",
    icon: SearchCheck,
  },
  {
    id: 4,
    title: "4. Component Lifecycle",
    subtitle: "Birth, Growth & Unmount Sim",
    icon: HeartPulse,
  },
];

const LEGO_BLOCKS = [
  {
    id: "navbar",
    tag: "<NavBar />",
    label: "Top Navigation Bar",
    color: "#38bdf8",
    html: '<nav class="top-nav">🌐 MyCoolApp</nav>',
    css: ".top-nav { background: #1e293b; padding: 10px; color: white; }",
    preview: () => (
      <div className={styles.mockNav}>
        <span>🌐 MyCoolApp</span>
        <span className={styles.mockLinks}>Home • Profile</span>
      </div>
    ),
  },
  {
    id: "hero",
    tag: "<ProfileCard />",
    label: "User Profile Card",
    color: "#a855f7",
    html: '<div class="card"><h3>Alex</h3><p>React Explorer</p></div>',
    css: ".card { border-radius: 8px; background: #2e1065; padding: 12px; }",
    preview: () => (
      <div className={styles.mockCard}>
        <div className={styles.avatar}>🧑‍🚀</div>
        <div>
          <strong>Alex the Explorer</strong>
          <div className={styles.subText}>Level 1 React Builder</div>
        </div>
      </div>
    ),
  },
  {
    id: "counter",
    tag: "<LikeButton />",
    label: "Interactive Like Button",
    color: "#f43f5e",
    html: '<button class="like-btn">❤️ Likes: 42</button>',
    css: ".like-btn { background: #e11d48; color: white; border: none; }",
    preview: () => <InteractiveMiniLike />,
  },
];

function InteractiveMiniLike() {
  const [likes, setLikes] = useState(42);
  return (
    <button
      onClick={() => setLikes((l) => l + 1)}
      className={styles.mockLikeBtn}
    >
      ❤️ Click to Like: <strong>{likes}</strong>
    </button>
  );
}

export function InteractivePlayground({ onSwitchToProMode }) {
  const [activeMission, setActiveMission] = useState(1);
  const [completedMissions, setCompletedMissions] = useState([1]);

  const markComplete = (id) => {
    if (!completedMissions.includes(id)) {
      setCompletedMissions([...completedMissions, id]);
    }
  };

  return (
    <div className={styles.playgroundContainer}>
      {/* Top Gamified Journey Header */}
      <header className={styles.journeyHeader}>
        <div className={styles.brandBlock}>
          <div className={styles.sparkleLogo}>
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className={styles.mainTitle}>DevLens Visual Quest</h1>
            <p className={styles.subTitle}>
              Learn React from zero through interactive animations & mini-games
            </p>
          </div>
        </div>

        {/* Mission Stepper */}
        <div className={styles.missionTabs}>
          {MISSIONS.map((m) => {
            const Icon = m.icon;
            const isActive = activeMission === m.id;
            const isDone = completedMissions.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => setActiveMission(m.id)}
                className={`${styles.missionTab} ${
                  isActive ? styles.missionActive : ""
                }`}
              >
                <Icon size={15} />
                <div className={styles.tabText}>
                  <span className={styles.tabTitle}>{m.title}</span>
                  <span className={styles.tabSub}>{m.subtitle}</span>
                </div>
                {isDone && (
                  <CheckCircle2 size={14} className={styles.doneIcon} />
                )}
              </button>
            );
          })}
        </div>

        {onSwitchToProMode && (
          <button onClick={onSwitchToProMode} className={styles.modeToggleBtn}>
            <Code size={14} /> Switch to Code Lab
          </button>
        )}
      </header>

      {/* Main Interactive Stage */}
      <main className={styles.stageArea}>
        {activeMission === 1 && (
          <Mission1LegoBuilder
            onComplete={() => {
              markComplete(1);
              setActiveMission(2);
            }}
          />
        )}
        {activeMission === 2 && (
          <Mission2CompilerMachine
            onComplete={() => {
              markComplete(2);
              setActiveMission(3);
            }}
          />
        )}
        {activeMission === 3 && (
          <Mission3ReconcilerGame
            onComplete={() => {
              markComplete(3);
              setActiveMission(4);
            }}
          />
        )}
        {activeMission === 4 && (
          <Mission4LifecyclePet onComplete={() => markComplete(4)} />
        )}
      </main>
    </div>
  );
}

/* ============================================================================
   MISSION 1: DRAG & DROP LEGO COMPONENT BUILDER
   ============================================================================ */
function Mission1LegoBuilder({ onComplete }) {
  const [droppedBlocks, setDroppedBlocks] = useState([LEGO_BLOCKS[0]]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragStart = (e, blockId) => {
    e.dataTransfer.setData("text/plain", blockId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const blockId = e.dataTransfer.getData("text/plain");
    const found = LEGO_BLOCKS.find((b) => b.id === blockId);
    if (found) {
      setDroppedBlocks((prev) => [
        ...prev,
        { ...found, instanceId: Date.now() },
      ]);
    }
  };

  const addBlockByClick = (block) => {
    setDroppedBlocks((prev) => [...prev, { ...block, instanceId: Date.now() }]);
  };

  return (
    <div className={styles.missionWrap}>
      <div className={styles.storyBanner}>
        <div>
          <h2>🧱 Mission 1: What is React? (Think LEGO Blocks!)</h2>
          <p>
            Without React, websites are giant, messy walls of HTML.{" "}
            <strong>
              React lets you build custom LEGO bricks called "Components"
            </strong>{" "}
            (like <code>&lt;NavBar /&gt;</code> or{" "}
            <code>&lt;LikeButton /&gt;</code>). At the very end, React
            translates your bricks into normal <strong>HTML & CSS</strong> that
            the browser understands!
          </p>
        </div>
        <button onClick={onComplete} className={styles.nextMissionBtn}>
          Next Mission: How Code Becomes HTML <ArrowRight size={15} />
        </button>
      </div>

      <div className={styles.threeColStage}>
        {/* Column 1: Draggable React Bricks */}
        <div className={styles.panelCard}>
          <div className={styles.panelTitle}>
            1. DRAG (OR CLICK) REACT LEGO BRICKS
          </div>
          <p className={styles.helperHint}>
            Drag any React Component below into the Drop Zone →
          </p>
          <div className={styles.brickList}>
            {LEGO_BLOCKS.map((block) => (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, block.id)}
                onClick={() => addBlockByClick(block)}
                className={styles.draggableBrick}
                style={{ borderLeftColor: block.color }}
              >
                <div className={styles.brickTag} style={{ color: block.color }}>
                  {block.tag}
                </div>
                <div className={styles.brickDesc}>{block.label}</div>
                <span className={styles.dragBadge}>Drag or Click +</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Drop Zone & Visual App */}
        <div
          className={`${styles.panelCard} ${
            isDraggingOver ? styles.dropZoneActive : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
        >
          <div className={styles.panelHeaderFlex}>
            <span className={styles.panelTitle}>
              2. YOUR REACT APP CANVAS (DROP ZONE)
            </span>
            <button
              onClick={() => setDroppedBlocks([])}
              className={styles.clearBtn}
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>

          {droppedBlocks.length === 0 ? (
            <div className={styles.emptyDropBox}>
              Drop a React Component Brick here!
            </div>
          ) : (
            <div className={styles.assembledApp}>
              {droppedBlocks.map((b, i) => {
                const PreviewComp = b.preview;
                return (
                  <div key={b.instanceId || i} className={styles.assembledItem}>
                    <div className={styles.componentWrapperLabel}>{b.tag}</div>
                    <PreviewComp />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Column 3: Final Browser HTML & CSS Output */}
        <div className={styles.panelCard}>
          <div className={styles.panelTitle}>
            3. WHAT THE BROWSER RECEIVES AT LAST (HTML + CSS)
          </div>
          <p className={styles.helperHint}>
            Browsers don't understand React tags like{" "}
            <code>&lt;ProfileCard /&gt;</code>. React converts your bricks into
            this pure HTML & CSS:
          </p>

          <div className={styles.codeBoxLabel}>FINAL HTML IN BROWSER:</div>
          <pre className={styles.outputPre}>
            {droppedBlocks.length === 0
              ? "<!-- Empty Page -->"
              : droppedBlocks.map((b) => b.html).join("\n\n")}
          </pre>

          <div className={styles.codeBoxLabel}>FINAL CSS STYLES:</div>
          <pre className={styles.outputPreCss}>
            {droppedBlocks.length === 0
              ? "/* No styles */"
              : droppedBlocks.map((b) => b.css).join("\n")}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   MISSION 2: ANIMATED COMPILER CONVEYOR BELT (JSX -> VIRTUAL DOM -> HTML/CSS)
   ============================================================================ */
function Mission2CompilerMachine({ onComplete }) {
  const [stage, setStage] = useState(1); // 1: JSX, 2: React.createElement, 3: Virtual DOM JS Object, 4: Browser HTML+CSS
  const [badgeColor, setBadgeColor] = useState("gold");
  const [userName, setUserName] = useState("Maya");

  const STAGES = [
    {
      id: 1,
      name: "Step 1: You Write JSX",
      desc: "JSX looks like HTML inside JavaScript, making it super easy to read. But browsers cannot run JSX directly!",
    },
    {
      id: 2,
      name: "Step 2: Compiler (Babel / Vite)",
      desc: "Behind the scenes, Vite/Babel translates your JSX tags into normal JavaScript function calls: React.createElement(...)",
    },
    {
      id: 3,
      name: "Step 3: Virtual DOM (JS Blueprint)",
      desc: "When React runs that function, it creates a lightweight JavaScript object in memory—like an architect’s blueprint!",
    },
    {
      id: 4,
      name: "Step 4: Real Browser HTML & CSS!",
      desc: "Finally, ReactDOM reads the blueprint and builds real HTML tags and CSS styles inside the browser window!",
    },
  ];

  return (
    <div className={styles.missionWrap}>
      <div className={styles.storyBanner}>
        <div>
          <h2>
            ⚙️ Mission 2: Inside the Machine — How React Becomes HTML & CSS
          </h2>
          <p>
            Ever wondered what happens at the inner level? Click through the{" "}
            <strong>4 Conveyor Belt Stations</strong> below and customize the
            props to watch your code transform into pure HTML & CSS at the very
            end.
          </p>
        </div>
        <button onClick={onComplete} className={styles.nextMissionBtn}>
          Next Mission: Virtual DOM Game <ArrowRight size={15} />
        </button>
      </div>

      {/* Interactive Customizer Bar */}
      <div className={styles.machineControls}>
        <div className={styles.inputGroup}>
          <span>Change Name Prop:</span>
          {["Maya", "Rohan", "Zara"].map((n) => (
            <button
              key={n}
              onClick={() => setUserName(n)}
              className={userName === n ? styles.activeChip : styles.chip}
            >
              {n}
            </button>
          ))}
        </div>

        <div className={styles.inputGroup}>
          <span>Change CSS Theme:</span>
          {[
            { id: "gold", label: "Gold Glow" },
            { id: "cyber", label: "Cyber Blue" },
            { id: "emerald", label: "Emerald" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setBadgeColor(t.id)}
              className={badgeColor === t.id ? styles.activeChip : styles.chip}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Stage Animated Conveyor Belt */}
      <div className={styles.conveyorGrid}>
        {STAGES.map((s) => {
          const isCurrent = stage === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setStage(s.id)}
              className={`${styles.stationCard} ${
                isCurrent ? styles.stationActive : ""
              }`}
            >
              <div className={styles.stationTop}>
                <span className={styles.stationNum}>STATION {s.id}</span>
                {isCurrent && (
                  <span className={styles.activePulse}>ACTIVE</span>
                )}
              </div>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* X-Ray Inspector Window for Selected Station */}
      <div className={styles.xrayStage}>
        <div className={styles.xrayCodeSide}>
          <div className={styles.panelTitle}>
            INNER LEVEL X-RAY (STATION {stage} OF 4)
          </div>
          {stage === 1 && (
            <pre
              className={styles.bigPre}
            >{`// 1. You write friendly JSX in your .jsx file:
function VIPBadge() {
  return (
    <div className="vip-${badgeColor}">
      <h2>🌟 VIP: ${userName}</h2>
    </div>
  );
}`}</pre>
          )}
          {stage === 2 && (
            <pre
              className={styles.bigPre}
            >{`// 2. Vite/Babel converts JSX into standard JS:
import { jsx as _jsx } from "react/jsx-runtime";

function VIPBadge() {
  return _jsx("div", {
    className: "vip-${badgeColor}",
    children: _jsx("h2", {
      children: "🌟 VIP: ${userName}"
    })
  });
}`}</pre>
          )}
          {stage === 3 && (
            <pre
              className={styles.bigPre}
            >{`// 3. React creates a lightweight JS Object (Virtual DOM):
{
  type: "div",
  props: {
    className: "vip-${badgeColor}",
    children: {
      type: "h2",
      props: { children: "🌟 VIP: ${userName}" }
    }
  }
}`}</pre>
          )}
          {stage === 4 && (
            <pre
              className={styles.bigPre}
            >{`<!-- 4. Finally, ReactDOM injects pure HTML & CSS into index.html! -->
<div id="root">
  <div class="vip-${badgeColor}">
    <h2>🌟 VIP: ${userName}</h2>
  </div>
</div>

<style>
  .vip-${badgeColor} {
    padding: 16px;
    border-radius: 10px;
  }
</style>`}</pre>
          )}
        </div>

        <div className={styles.xrayPreviewSide}>
          <div className={styles.panelTitle}>FINAL BROWSER RESULT</div>
          <div
            className={`${styles.vipPreview} ${styles[`theme_${badgeColor}`]}`}
          >
            <h2>🌟 VIP: {userName}</h2>
            <p>Rendered as pure HTML & CSS in the browser!</p>
          </div>
          <div className={styles.conveyorButtons}>
            <button
              disabled={stage === 1}
              onClick={() => setStage((s) => Math.max(1, s - 1))}
              className={styles.stepActionBtn}
            >
              ← Previous Station
            </button>
            <button
              disabled={stage === 4}
              onClick={() => setStage((s) => Math.min(4, s + 1))}
              className={styles.stepActionPrimary}
            >
              Next Station →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   MISSION 3: RECONCILIATION MINI-GAME ("SPOT THE DIFF!")
   ============================================================================ */
function Mission3ReconcilerGame({ onComplete }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(
    "Click the ONLY node in the New Virtual Tree that changed!"
  );

  const NODES = [
    {
      id: "header",
      label: '<header> "Game Shop" </header>',
      oldText: '<header> "Game Shop" </header>',
      changed: false,
    },
    {
      id: "coins",
      label: '<span> "Coins: 150" </span>',
      oldText: '<span> "Coins: 100" </span>',
      changed: true,
    },
    {
      id: "footer",
      label: '<footer> "© 2026" </footer>',
      oldText: '<footer> "© 2026" </footer>',
      changed: false,
    },
  ];

  const handleNodeClick = (node) => {
    setSelectedNode(node.id);
    if (node.changed) {
      setScore((s) => s + 100);
      setFeedback(
        "🎯 BINGO! You found the exact difference! React only updates this single <span> in the real HTML DOM instead of rebuilding the whole page!"
      );
    } else {
      setFeedback(
        "❌ Oops! Look closely—this node is identical in both trees. Re-painting unchanged HTML wastes browser energy! Try clicking the <span> node."
      );
    }
  };

  return (
    <div className={styles.missionWrap}>
      <div className={styles.storyBanner}>
        <div>
          <h2>
            🤖 Mission 3: Play as React's "Reconciler Robot" (Virtual DOM
            Diffing)
          </h2>
          <p>
            Why does React use a <strong>Virtual DOM</strong>? Because
            rebuilding the entire HTML page on every click is slow! Instead,
            React compares the <strong>Old Blueprint</strong> with the{" "}
            <strong>New Blueprint</strong> (this comparison is called{" "}
            <strong>Reconciliation</strong>) and patches <em>only</em> what
            changed.
          </p>
        </div>
        <button onClick={onComplete} className={styles.nextMissionBtn}>
          Next Mission: Component Lifecycle <ArrowRight size={15} />
        </button>
      </div>

      <div className={styles.gameScoreBar}>
        <span>
          🤖 Your Reconciler Score: <strong>{score} pts</strong>
        </span>
        <span className={styles.feedbackBanner}>{feedback}</span>
      </div>

      <div className={styles.diffGameGrid}>
        {/* Old Virtual DOM Tree */}
        <div className={styles.panelCard}>
          <div className={styles.panelTitle}>
            OLD VIRTUAL DOM BLUEPRINT (BEFORE CLICK)
          </div>
          <div className={styles.treeVisual}>
            <div className={styles.rootPill}>&lt;div className="app"&gt;</div>
            {NODES.map((n) => (
              <div key={n.id} className={styles.treeChildStatic}>
                {n.oldText}
              </div>
            ))}
          </div>
        </div>

        {/* New Virtual DOM Tree (Interactive Game) */}
        <div className={styles.panelCard}>
          <div className={styles.panelTitle}>
            NEW VIRTUAL DOM BLUEPRINT (CLICK THE CHANGED NODE!)
          </div>
          <div className={styles.treeVisual}>
            <div className={styles.rootPill}>&lt;div className="app"&gt;</div>
            {NODES.map((n) => {
              const isPicked = selectedNode === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => handleNodeClick(n)}
                  className={`${styles.treeChildInteractive} ${
                    isPicked
                      ? n.changed
                        ? styles.nodeCorrect
                        : styles.nodeWrong
                      : ""
                  }`}
                >
                  <span>{n.label}</span>
                  <span className={styles.clickPrompt}>Inspect Diff 🔍</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   MISSION 4: LIFECYCLE TAMAGOTCHI (MOUNT -> UPDATE -> UNMOUNT)
   ============================================================================ */
function Mission4LifecyclePet({ onComplete }) {
  const [lifecycleState, setLifecycleState] = useState("unmounted"); // 'unmounted' | 'mounted' | 'updated'
  const [energy, setEnergy] = useState(1);
  const [history, setHistory] = useState([
    'Component is waiting to be born (Unmounted). Click "1. Mount Component"!',
  ]);

  const handleMount = () => {
    setLifecycleState("mounted");
    setEnergy(1);
    setHistory((h) => [
      "🌱 MOUNTING: React ran RoboPet(), created the HTML <div>, and inserted it into the browser DOM!",
      ...h,
    ]);
  };

  const handleFeed = () => {
    if (lifecycleState === "unmounted") return;
    setLifecycleState("updated");
    setEnergy((e) => e + 1);
    setHistory((h) => [
      `⚡ UPDATING: State changed to Energy Lv.${
        energy + 1
      }! React re-ran RoboPet() and updated only the energy text in HTML.`,
      ...h,
    ]);
  };

  const handleUnmount = () => {
    setLifecycleState("unmounted");
    setHistory((h) => [
      "💤 UNMOUNTING: React cleaned up timers/effects and removed RoboPet’s HTML from the page!",
      ...h,
    ]);
    onComplete();
  };

  return (
    <div className={styles.missionWrap}>
      <div className={styles.storyBanner}>
        <div>
          <h2>
            🌱 Mission 4: The Component Lifecycle (Mount → Update → Unmount)
          </h2>
          <p>
            Every React component goes through 3 life stages:{" "}
            <strong>1. Mounting</strong> (born onto the screen),{" "}
            <strong>2. Updating</strong> (growing/changing when state or props
            change), and <strong>3. Unmounting</strong> (cleaned up and removed
            from the screen).
          </p>
        </div>
      </div>

      <div className={styles.threeColStage}>
        {/* Lifecycle Controls */}
        <div className={styles.panelCard}>
          <div className={styles.panelTitle}>1. TRIGGER LIFECYCLE STAGES</div>
          <div className={styles.lifecycleButtons}>
            <button
              onClick={handleMount}
              disabled={lifecycleState !== "unmounted"}
              className={styles.lifeBtnMount}
            >
              🌱 1. Mount Component (Birth)
            </button>

            <button
              onClick={handleFeed}
              disabled={lifecycleState === "unmounted"}
              className={styles.lifeBtnUpdate}
            >
              ⚡ 2. Update State: Feed Pet (+1)
            </button>

            <button
              onClick={handleUnmount}
              disabled={lifecycleState === "unmounted"}
              className={styles.lifeBtnUnmount}
            >
              💤 3. Unmount Component (Remove)
            </button>
          </div>
        </div>

        {/* Visual Pet Stage */}
        <div className={styles.panelCard}>
          <div className={styles.panelTitle}>2. LIVE COMPONENT STAGE</div>
          <div className={styles.petArena}>
            {lifecycleState === "unmounted" ? (
              <div className={styles.deadZone}>
                👻 No HTML in DOM (Component is Unmounted)
              </div>
            ) : (
              <div className={styles.petBox}>
                <div className={styles.petEmoji}>
                  {energy >= 3 ? "🦖" : energy === 2 ? "🐲" : "🥚"}
                </div>
                <h3>&lt;RoboPet /&gt; is Alive!</h3>
                <span className={styles.energyPill}>
                  Energy State: {energy}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Live Lifecycle Log */}
        <div className={styles.panelCard}>
          <div className={styles.panelTitle}>3. WHAT HAPPENED INSIDE REACT</div>
          <div className={styles.lifeLogList}>
            {history.map((item, idx) => (
              <div key={idx} className={styles.lifeLogItem}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
