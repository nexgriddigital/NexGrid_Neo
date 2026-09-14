export type NavigationPage = 
  | 'home' 
  | 'services' 
  | 'work' 
  | 'pricing' 
  | 'about' 
  | 'contact' 
  | 'client-portal' 
  | 'admin-portal';

export type UserRole = 'visitor' | 'client' | 'admin';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  phone?: string;
  contractId?: string;
}

export type RetainerTier = 'Launch' | 'Scale & Performance' | 'Enterprise Grid';

export interface Contract {
  id: string;
  clientName: string;
  clientEmail: string;
  company: string;
  tier: RetainerTier;
  monthlyFee: number;
  startDate: string;
  expirationDate: string;
  daysRemaining: number;
  status: 'active' | 'expiring_soon' | 'expired' | 'pending_renewal';
  hoursAllocated: number;
  hoursUsed: number;
  slaHours: number;
  scopeItems: string[];
  dedicatedEngineer: string;
  lastUpdated: string;
}

export type MaintenanceCategory = 
  | 'Bug Fix' 
  | 'Feature Update' 
  | 'Performance Optimization' 
  | 'Security Patch' 
  | 'Emergency Down';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';

export type MaintenanceStatus = 'submitted' | 'accepted' | 'in_progress' | 'completed' | 'declined';

export interface MaintenanceRequest {
  id: string;
  clientEmail: string;
  clientCompany: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  assignedEngineer?: string;
  estimatedHours?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  clientEmail: string;
  clientCompany: string;
  content: string;
  timestamp: string;
  readByAdmin?: boolean;
  readByClient?: boolean;
}

export interface ProjectInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceCategory: string;
  estimatedBudget: string;
  targetTimeline: string;
  projectSummary: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'contacted';
}

export interface ColorTokens {
  primary: string;
  on_primary: string;
  secondary: string;
  on_secondary: string;
  accent: string;
  on_accent: string;
  background: string;
  foreground: string;
  card: string;
  card_foreground: string;
  muted: string;
  muted_foreground: string;
  border: string;
  destructive: string;
  on_destructive: string;
  ring: string;
  notes?: string;
  cta?: string;
  text?: string;
  on_cta?: string;
}

export interface DesignPattern {
  name: string;
  sections: string;
  cta_placement: string;
  color_strategy: string;
  conversion: string;
}

export interface UIStyle {
  id: string;
  name: string;
  type: string;
  effects: string;
  keywords: string;
  best_for: string;
  performance: string;
  accessibility: string;
  light_mode: string;
  dark_mode: string;
}

export interface TypographySpec {
  heading: string;
  body: string;
  mood: string;
  best_for: string;
  google_fonts_url?: string;
  css_import?: string;
}

export interface DesignSystemResult {
  project_name: string;
  category: string;
  pattern: DesignPattern;
  style: UIStyle;
  colors: ColorTokens;
  typography: TypographySpec;
  key_effects: string;
  anti_patterns: string;
  constraints?: string[];
  severity?: string;
  dials?: {
    variance: number | null;
    variance_label: string | null;
    motion: number | null;
    motion_label: string | null;
    density: number | null;
    density_label: string | null;
  };
}

export interface EngineStatus {
  status: string;
  skill: string;
  repository: string;
  pythonAvailable: boolean;
  scriptAvailable: boolean;
  scriptPath: string;
  capabilities: {
    reasoningRules: number;
    uiStyles: number;
    activeStyles: number;
    colorPalettes: number;
    fontPairings: number;
    uxGuidelines: number;
    chartTypes: number;
    supportedStacks: number;
  };
}

export interface UXGuidelineItem {
  category: string;
  guideline: string;
  do: string;
  dont: string;
  wcag?: string;
  severity: "High" | "Medium" | "Critical";
}

export interface ProvisionedClient {
  id: string;
  email: string;
  name: string;
  company: string;
  accessKey: string;
  contractId: string;
  tier: RetainerTier;
  hoursAllocated: number;
  slaHours: number;
  monthlyFee: number;
  status: 'active' | 'suspended';
  createdAt: string;
  provisionedBy: string;
}

export const MASTER_ADMIN_EMAIL = 'nexgriddigital@gmail.com';

export const ADMIN_USER_SESSION: UserSession = {
  id: 'admin-master-001',
  email: MASTER_ADMIN_EMAIL,
  name: 'NexGrid Operations Admin',
  role: 'admin',
  company: 'NexGrid Digital Solutions',
  phone: '+251 906697634'
};

// Aliased for compatibility
export const DEMO_ADMIN_USER = ADMIN_USER_SESSION;

