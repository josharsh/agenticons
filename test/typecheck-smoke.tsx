// Compile-only smoke test: consumed by `npm run typecheck` (tsc --noEmit).
import * as React from 'react';
import { Agent, ToolCall, ContextWindow, McpIcon, createIcon, type AgenticonProps } from 'agenticons';
import Handoff from 'agenticons/icons/handoff';

const Custom = createIcon('custom', [['path', { d: 'M0 0' }]]);

export function Smoke(props: AgenticonProps) {
  const ref = React.useRef<SVGSVGElement>(null);
  return (
    <div>
      <Agent size={16} strokeWidth={1.5} />
      <ToolCall absoluteStrokeWidth color="#7c3aed" />
      <ContextWindow className="mr-2" aria-label="Context window" />
      <McpIcon ref={ref} onClick={() => {}} />
      <Handoff {...props} />
      <Custom size="1em" />
    </div>
  );
}
