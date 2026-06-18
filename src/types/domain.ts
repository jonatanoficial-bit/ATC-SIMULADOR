/* Skyward Control F08 — canonical TypeScript domain contracts. */

type FlightKind = 'arrival' | 'departure';
type AircraftStatus = 'PARKED' | 'PUSHBACK' | 'READY_TAXI' | 'TAXI' | 'HOLD_SHORT' | 'LINEUP' | 'DEP' | 'APP' | 'HOLD' | 'FINAL' | 'EMERG';
type RequestType = 'landing' | 'pushback' | 'taxi' | 'lineup' | 'takeoff' | 'emergency' | 'lowfuel' | 'panpan';
type AtcRequestPriority = 'normal' | 'warn' | 'urgent';
type SafetyLevel = 'ok' | 'warn' | 'danger';

interface BuildInfo {
  product: string;
  version: string;
  phase: string;
  phaseName: string;
  channel: string;
  build: string;
  builtAt: string;
  builtAtIso: string;
  schema: number;
  target: string;
  contractSchema?: number;
  testSchema?: number;
  saveVaultSchema?: number;
  pwaSchema?: number;
  cacheSchema?: number;
  uxSchema?: number;
}

interface AirportDefinition {
  icao: string;
  name: string;
  city: string;
  country: string;
  level: number;
  runways: number;
  traffic: string;
  weather: string;
  unlocked: boolean;
}

interface ControllerProfile {
  name: string;
  avatar: string;
  country: string;
  airport: string;
  xp: number;
  level: number;
  score: number;
  turns: number;
}

interface ProfileSaveV1 {
  schema: 1;
  build: string;
  at: number;
  reason: string;
  profile: ControllerProfile;
}

interface TrailPoint { x: number; y: number; }

interface AircraftState {
  id: string;
  type: string;
  kind: FlightKind;
  status: AircraftStatus;
  x: number;
  y: number;
  heading: number;
  speed: number;
  alt: number;
  targetAlt: number;
  trail: TrailPoint[];
  risk: number;
  selected: boolean;
  cleared: boolean;
  emergency: boolean;
  emergencyType: string | null;
  fuel: number;
  fuelState: string;
  damage: number;
  hold: boolean;
  groundTimer: number;
  request: RequestType | null;
  requestedAt: number;
  nextFix: string | null;
  sector?: string;
}

interface AircraftCatalogEntry {
  call: string;
  type: string;
  kind: FlightKind;
  alt: number;
  speed: number;
  state: AircraftStatus;
}

interface AtcRequest {
  id: string;
  type: RequestType;
  priority: AtcRequestPriority;
  text: string;
  time: number;
}

interface GameStats {
  landed: number;
  departed: number;
  conflicts: number;
  commands: number;
  emergencies: number;
  requests: number;
  denied: number;
  runwayIncursions: number;
  blocked: number;
  safetyWarnings: number;
  lowFuel: number;
  damaged: number;
  maydayResolved: number;
}

interface SnapshotV3 {
  schema: 3;
  saveId: string;
  sessionId: string;
  build: string;
  reason: string;
  at: number;
  elapsed: number;
  selected: string | null;
  selectedRequest: AtcRequest | null;
  runwayOccupiedBy: string | null;
  aircraft: AircraftState[];
  requests: AtcRequest[];
  score: number;
  stats: Partial<GameStats>;
  mission: unknown;
  profileAirport: string;
  profile: ControllerProfile;
}

interface ValidationIssue {
  path: string;
  code: string;
  message: string;
  value?: unknown;
}

interface ValidationResult<T> {
  ok: boolean;
  value?: T;
  issues: ValidationIssue[];
}

interface ContractDiagnostic {
  contract: string;
  ok: boolean;
  issueCount: number;
  at: number;
  context: string;
}

interface ContractApi {
  readonly contractSchema: number;
  readonly version: string;
  validateBuildInfo(value: unknown, context?: string): ValidationResult<BuildInfo>;
  validateAirport(value: unknown, context?: string): ValidationResult<AirportDefinition>;
  validateAirports(value: unknown, context?: string): ValidationResult<AirportDefinition[]>;
  validateProfile(value: unknown, context?: string): ValidationResult<ControllerProfile>;
  validateProfileSave(value: unknown, context?: string): ValidationResult<ProfileSaveV1>;
  validateAircraft(value: unknown, context?: string): ValidationResult<AircraftState>;
  validateAircraftList(value: unknown, context?: string): ValidationResult<AircraftState[]>;
  validateAircraftCatalog(value: unknown, context?: string): ValidationResult<AircraftCatalogEntry[]>;
  validateRequest(value: unknown, context?: string): ValidationResult<AtcRequest>;
  validateRequests(value: unknown, context?: string): ValidationResult<AtcRequest[]>;
  validateSnapshot(value: unknown, expectedSchema?: number, context?: string): ValidationResult<SnapshotV3>;
  validate(contract: string, value: unknown, context?: string): ValidationResult<unknown>;
  assert(contract: string, value: unknown, context?: string): unknown;
  sanitizeProfile(value: unknown, fallback?: ControllerProfile): ControllerProfile;
  sanitizeAircraft(value: unknown): AircraftState | null;
  sanitizeRequest(value: unknown): AtcRequest | null;
  getDiagnostics(): readonly ContractDiagnostic[];
  clearDiagnostics(): void;
}

interface Window {
  SKYWARD_CONTRACTS?: Readonly<ContractApi>;
  SKYWARD_MODULES?: string[];
}
