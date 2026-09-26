export type SubmissionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'EVALUATING'
  | 'COMPLETED'
  | 'FAILED';

export interface ClassDesign {
  type?: string;
  id: string;
  name: string;
  responsibility: string;
  attributes: string[];
  methods: string[];
}

export type RelationshipType =
  | 'ASSOCIATION'
  | 'AGGREGATION'
  | 'COMPOSITION'
  | 'INHERITANCE'
  | 'IMPLEMENTATION'
  | 'DEPENDENCY';

export interface RelationshipDesign {
  id: string;
  sourceClass: string;
  targetClass: string;
  relationship: RelationshipType | string;
  reason: string;
}

export interface ClassDiagramArtifact {
  mermaidSyntax?: string;
  rawJson?: Record<string, unknown>;
}

export interface Submission {
  id: string;
  submissionId: string;
  attemptId: string;
  problemId: string;
  classes: ClassDesign[];
  relationships: RelationshipDesign[];
  explanation: string;
  optionalCode?: string;
  diagram?: ClassDiagramArtifact; // CHANGE A readiness: extensible for future visual diagrams
  createdAt: string;
  updatedAt: string;
  status: SubmissionStatus;
  validationErrors?: string[];
  failureReason?: string;
}
