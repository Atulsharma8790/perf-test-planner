export interface PerfInput {
  appName: string
  appDescription: string
  targetEndpoints: string
  expectedUsers: string
  peakConcurrent: string
  rampUpSeconds: string
  slaP95: string
  slaP99: string
  slaErrorRate: string
  testTypes: string[]
  additionalContext: string
}

export interface LoadScenario {
  name: string
  type: string
  description: string
  stages: { duration: string; target: number; description: string }[]
  vus: number
  rationale: string
}

export interface SLAThreshold {
  metric: string
  threshold: string
  rationale: string
  alertRecommendation: string
}

export interface EndpointPlan {
  endpoint: string
  method: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  loadShare: string
  checks: string[]
  notes: string
}

export interface PerfOutput {
  strategy: string
  testOrder: string[]
  scenarios: LoadScenario[]
  endpoints: EndpointPlan[]
  k6Script: string
  jmeterSummary: string
  thresholds: SLAThreshold[]
  monitoringChecklist: string[]
  risks: string[]
  recommendations: string[]
}
