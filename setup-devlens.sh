
#!/usr/bin/env bash

set -e

echo "Setting up DevLens directory structure..."

# Main source directories
mkdir -p src/styles

# Layout components
mkdir -p src/components/layout

# Editor components
mkdir -p src/components/editor

# Preview components
mkdir -p src/components/preview

# Visualizer components
mkdir -p src/components/visualizer

# Explanation components
mkdir -p src/components/explanation

# Experiment directories
mkdir -p src/experiments/exp1-js-vs-react
mkdir -p src/experiments/exp2-render-pipeline
mkdir -p src/experiments/exp3-component-explorer

# Global application files
touch src/main.jsx
touch src/App.jsx

# Styles
touch src/styles/tokens.css
touch src/styles/global.css

# Layout
touch src/components/layout/AppShell.jsx
touch src/components/layout/AppShell.module.css
touch src/components/layout/Sidebar.jsx
touch src/components/layout/Sidebar.module.css

# Editor
touch src/components/editor/CodePanel.jsx
touch src/components/editor/CodePanel.module.css

# Preview
touch src/components/preview/LivePreview.jsx
touch src/components/preview/ErrorBoundary.jsx
touch src/components/preview/LivePreview.module.css

# Visualizer
touch src/components/visualizer/ExecutionVisualizer.jsx
touch src/components/visualizer/ExecutionVisualizer.module.css

# Explanation
touch src/components/explanation/ExplanationPanel.jsx
touch src/components/explanation/ExplanationPanel.module.css

# Experiment registry
touch src/experiments/index.js

echo "DevLens structure created successfully!"
echo "Existing files were preserved."
