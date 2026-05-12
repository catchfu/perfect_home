export type ProblemCategory =
  | "entrance"
  | "flow"
  | "living_room"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "lighting"
  | "storage"
  | "feng_shui"

export interface Problem {
  id: string
  zone: string
  issue: string
  consequence: string
  category: ProblemCategory
  severity: number
  position?: { x: number; y: number }
}

export interface Priority {
  level: number
  title: string
  description: string
}

export interface Recommendation {
  zone: string
  action: string
  effect: string
  cost: "low" | "medium" | "high"
}

export interface FloorPlanContext {
  city?: string
  district?: string
  direction?: string
  balconyDirection?: string
  floor?: number
  totalFloors?: number
  externalEnvironment?: string[]
  occupants?: number
  currentIssues?: string[]
  renovationScope?: string
}

export interface DiagnosisReportData {
  id: string
  floorPlanId: string
  title: string
  direction?: string
  problems: Problem[]
  causalChain?: string
  priorities: Priority[]
  recommendations: Recommendation[]
  bottomLine?: string
  infographicLandscape?: string
  infographicPortrait?: string
  createdAt: string
}

export interface AnalysisResult {
  id: string
  floor_plan: FloorPlanContext
  subject: string
  aspects: {
    entrance: string[]
    flow: string[]
    living_room: string[]
    bedroom: string[]
    kitchen: string[]
    bathroom: string[]
    lighting: string[]
    storage: string[]
    feng_shui: string[]
  }
  major_issues: { position: string; problem: string; consequence: string }[]
  chain: string
  priorities: { level: number; title: string; description: string }[]
  suggestions: { zone: string; action: string; effect: string }[]
  motto: string
}
