import type { PerfInput } from './types'

export function buildPrompt(input: PerfInput): string {
  return `You are a Senior Performance Engineer with 15+ years experience designing load tests at high-scale companies (Netflix, Uber, Shopify). You specialise in k6, JMeter, and Gatling.

Generate a complete performance test plan. Return your response in TWO clearly labelled parts:

PART 1 — valid JSON (no markdown, no code fences around the JSON itself):
{
  "strategy": "...",
  "testOrder": [...],
  "scenarios": [...],
  "endpoints": [...],
  "jmeterSummary": "...",
  "thresholds": [...],
  "monitoringChecklist": [...],
  "risks": [...],
  "recommendations": [...]
}

PART 2 — k6 script inside a fenced code block:
\`\`\`k6
<complete runnable k6 script here>
\`\`\`

APPLICATION:
- Name: ${input.appName}
- Description: ${input.appDescription}
- Target Endpoints:
${input.targetEndpoints}
- Expected total users: ${input.expectedUsers}
- Peak concurrent users: ${input.peakConcurrent}
- Ramp-up time: ${input.rampUpSeconds}s
- SLA p95: ${input.slaP95}ms
- SLA p99: ${input.slaP99}ms
- Max error rate: ${input.slaErrorRate}%
- Test types requested: ${input.testTypes.join(', ')}
- Additional context: ${input.additionalContext || 'None'}

JSON field details:
- strategy: 3-4 sentence executive test strategy covering goals, approach, and risk focus areas
- testOrder: ordered array of test type strings to run
- scenarios: one per requested test type, each with: name, type (smoke|load|stress|soak|spike|breakpoint), description, stages array [{duration, target (number VUs), description}], vus (peak number), rationale
- endpoints: one per endpoint provided, each with: endpoint, method, priority (critical|high|medium|low), loadShare (e.g. "40% of requests"), checks (array of strings), notes
- jmeterSummary: 150-200 word description of equivalent JMeter test plan (thread groups, ramp-up, HTTP samplers, assertions, listeners)
- thresholds: 4-6 items, each with: metric (real k6 metric name), threshold (e.g. "p(95)<500"), rationale, alertRecommendation
- monitoringChecklist: 4-6 strings
- risks: 3-4 strings
- recommendations: 3-5 strings

k6 script requirements (PART 2):
- Complete, runnable k6 JavaScript — valid k6 v0.46+ syntax
- Include imports (import http from 'k6/http'; import { check, sleep } from 'k6'; etc.)
- Define BASE_URL as a variable at the top
- Export options object with thresholds matching the SLAs and scenarios matching the requested test types
- Default function covers ALL endpoints from the input with realistic think time (sleep 1-3s)
- Include proper checks on each request (status, response time)
- Production-quality, not a toy example — minimum 60 lines`
}
