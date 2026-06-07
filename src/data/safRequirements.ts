export interface SAFRequirement {
  id: string;
  dimension: string;
  dimensionCode: string;
  description: string;
}

export const SAF_DIMENSIONS = [
  "Strategic Alignment, Vision and Roadmap",
  "Decision Making & Governance",
  "Solution Design & Methods",
  "Technology Choices",
  "Non-Functional Profile",
  "Reuse Principles and Development of Shared Services",
  "Documentation",
] as const;

export const SAF_REQUIREMENTS: SAFRequirement[] = [
  // Strategic Alignment, Vision and Roadmap
  {
    id: "S01",
    dimension: "Strategic Alignment, Vision and Roadmap",
    dimensionCode: "S",
    description:
      "The solution should be aligned to stated strategy approved at an executive level. e.g. TD Design Authority, P&P DA etc.",
  },
  {
    id: "S02",
    dimension: "Strategic Alignment, Vision and Roadmap",
    dimensionCode: "S",
    description:
      "We should be able to demonstrate which capabilities from the NHSE Business Capability Model the solution is realising, and any potential duplication identified.",
  },
  {
    id: "S03",
    dimension: "Strategic Alignment, Vision and Roadmap",
    dimensionCode: "S",
    description:
      "A well-formed and maintained product vision and roadmap should exist with appropriate detail around architecture elements.",
  },
  {
    id: "S04",
    dimension: "Strategic Alignment, Vision and Roadmap",
    dimensionCode: "S",
    description:
      "The solution design should be able to meet the stated user needs and overall business objectives/drivers.",
  },

  // Decision Making & Governance
  {
    id: "DM01",
    dimension: "Decision Making & Governance",
    dimensionCode: "DM",
    description:
      "Where a solution or part of solution is seen as tactical, short term or introduces / persists tech & architecture debt, remediation plans should be in place and agreed with the relevant stakeholders and governance groups. Architecture Debt should be identified with implications, rationale and future mitigation plans (recorded in an Architecture Debt Register). Plans should be realistic and funded.",
  },
  {
    id: "DM02",
    dimension: "Decision Making & Governance",
    dimensionCode: "DM",
    description:
      "Spend control (GaTS) and associated Government Digital Services & Service Design related guidance should be followed whilst developing the solution and be evidenced for service design & spend control reviews.",
  },
  {
    id: "DM03",
    dimension: "Decision Making & Governance",
    dimensionCode: "DM",
    description:
      "Architecture risks and issues should be managed effectively with the appropriate level of visibility and ownership.",
  },
  {
    id: "DM04",
    dimension: "Decision Making & Governance",
    dimensionCode: "DM",
    description:
      "There should be effective and commensurate stakeholder involvement with respect to solution design and architecture decisions.",
  },
  {
    id: "DM05",
    dimension: "Decision Making & Governance",
    dimensionCode: "DM",
    description:
      "The solution design and architecture decisions should be managed through a tiered governance process, ultimately leading, if appropriate, to TRG.",
  },
  {
    id: "DM06",
    dimension: "Decision Making & Governance",
    dimensionCode: "DM",
    description:
      "The overall approach to architecture governance should be appropriate and commensurate with the nature of the solution.",
  },
  {
    id: "DM07",
    dimension: "Decision Making & Governance",
    dimensionCode: "DM",
    description:
      "All Architecture decisions should be documented with a lightweight Architecture Decision Record with options and clear rationale.",
  },
  {
    id: "DM08",
    dimension: "Decision Making & Governance",
    dimensionCode: "DM",
    description:
      "All decision-making should be structured. E.g. identify key strategic drivers, user need, assess options against drivers, present rationale, clarity on trade-offs, dependencies, risks and issues understood.",
  },

  // Solution Design & Methods
  {
    id: "SD01",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description:
      "An appropriate design methodology should be followed e.g. Domain Driven Design and should include NHS/CDDO Service Design and Secure by Design principles and methods.",
  },
  {
    id: "SD02",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description:
      "The solution should be compliant with NHS England principles, policy, patterns and best practice.",
  },
  {
    id: "SD03",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description: "The solution should be compliant with relevant standards.",
  },
  {
    id: "SD04",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description:
      "Solution design should follow good practice design principles. E.g. Separation of concerns, Encapsulation / Modularisation, Loose coupling, High cohesion / single responsibility, Design for flexibility/change.",
  },
  {
    id: "SD05",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description:
      "Solutions should focus on commodity products and services where possible/sensible.",
  },
  {
    id: "SD06",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description:
      "An API First design methodology should be followed, where APIs are at the forefront of the design process, functionality and data is exposed via APIs and the needs of the API consumer have been considered.",
  },
  {
    id: "SD07",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description:
      "We should treat internal (NHS England) and external consumers equally.",
  },
  {
    id: "SD08",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description:
      "We should select the correct patterns for the use case, and any trade-offs justified and agreed.",
  },
  {
    id: "SD09",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description:
      "We should adopt the right standards for API development, supported by user, consumer, and market / supplier engagement.",
  },
  {
    id: "SD10",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description:
      "The API follows the lifecycle policy best practice as set out within Sunsetting (deprecation and retirement) policy. This should include any enforcement arrangements.",
  },
  {
    id: "SD11",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description:
      'Solutions should adhere to: Government "Secure by Design" policy, NCSC CAF Access Control Guidelines Policy - Strong Auth/MFA, Storage and Processing of Data Outside of the UK - Information Governance Policy, NHS England\'s API strategy and policy statements.',
  },
  {
    id: "SD12",
    dimension: "Solution Design & Methods",
    dimensionCode: "SD",
    description:
      "The relevant cloud Well Architected Framework should be followed, and the solutions assessed against it.",
  },

  // Technology Choices
  {
    id: "T01",
    dimension: "Technology Choices",
    dimensionCode: "T",
    description:
      "Technology choices should be made in line with the NHS England Technology Radar, corporate direction and wider industry trends using the associated processes to support decision making.",
  },
  {
    id: "T02",
    dimension: "Technology Choices",
    dimensionCode: "T",
    description:
      "Technology choices should be appropriate to the problem and non-functional needs. I.e. we are as equally aware of over-engineering as we are of under-engineering.",
  },
  {
    id: "T03",
    dimension: "Technology Choices",
    dimensionCode: "T",
    description:
      "An appraisal should be made of any vendor lock considerations and associated risks, and these are understood and accepted/mitigated.",
  },

  // Non-Functional Profile
  {
    id: "NF01",
    dimension: "Non-Functional Profile",
    dimensionCode: "NF",
    description:
      "Solutions should incorporate workload observability and understand service health.",
  },
  {
    id: "NF02",
    dimension: "Non-Functional Profile",
    dimensionCode: "NF",
    description:
      "Reliability & Resilience needs should be defined (in terms of standard NHS England service levels) and solution mechanisms to meet these needs are defined including metrics such as Recovery Time Objective (RTO) and Recovery Point Objective (RPO).",
  },
  {
    id: "NF03",
    dimension: "Non-Functional Profile",
    dimensionCode: "NF",
    description:
      "An overall volume and performance model should exist and includes business-realistic exceptional scenarios.",
  },
  {
    id: "NF04",
    dimension: "Non-Functional Profile",
    dimensionCode: "NF",
    description:
      "Methods to measure sustainability to establish baseline and show improvement should be defined.",
  },
  {
    id: "NF05",
    dimension: "Non-Functional Profile",
    dimensionCode: "NF",
    description:
      "Audit & logging requirements should be defined, and the solution can support them. NCSC Logging and Protective Monitoring, NCSC Principle 13: Audit information and alerting for customers.",
  },
  {
    id: "NF06",
    dimension: "Non-Functional Profile",
    dimensionCode: "NF",
    description:
      "Disaster Recovery & Business Continuity: There should be clear requirements (commensurate with service levels) around DR & BC (and a pragmatic approach taken with regards DR/BC events planned for). Continuity plans and supporting documentation should reflect the requirements, technical & architecture constraints etc.",
  },

  // Reuse Principles and Development of Shared Services
  {
    id: "RU01",
    dimension: "Reuse Principles and Development of Shared Services",
    dimensionCode: "RU",
    description:
      "If reusing existing capabilities, we should have confidence that any additional functionality required can be sensibly and cost effectively added to the existing service i.e. we are not bending something out of shape.",
  },
  {
    id: "RU02",
    dimension: "Reuse Principles and Development of Shared Services",
    dimensionCode: "RU",
    description:
      "For new capabilities we should identify/recognise the potential reuse opportunities which may drive design decisions, benefits etc.",
  },
  {
    id: "RU03",
    dimension: "Reuse Principles and Development of Shared Services",
    dimensionCode: "RU",
    description:
      "We should reuse capabilities as defined by NHS England shared services (e.g. CaaS, NHS Notify, MESH, PDS, CIS2, Splunk/Sentinel etc.).",
  },

  // Documentation
  {
    id: "D01",
    dimension: "Documentation",
    dimensionCode: "D",
    description:
      "All architecture documentation should be maintained (with supporting processes and change control) within the appropriate NHS England knowledge store(s) e.g. Aalto, SharePoint, Confluence.",
  },
  {
    id: "D02",
    dimension: "Documentation",
    dimensionCode: "D",
    description:
      'Documentation should be published "open by default" and exceptions handled according to policy i.e. sensitivity etc.',
  },
  {
    id: "D03",
    dimension: "Documentation",
    dimensionCode: "D",
    description:
      "The architecture documentation should be appropriate in scope and quality for the solution covering (but not exclusively): Architecture Vision, Architecture Roadmap, Layer Diagrams, Capability Model and Solution Mapping, Non functional requirements, Conceptual Architecture, Logical Architecture, Physical Architecture, Solution Architecture Overview (SDO), Key Architecture Decisions (KADs), Data Models, Data Flows, API Specifications, Volume and Performance Models, Architecture Decision Records, Assumption/Risks/Issues and Dependencies, Cyber Assessment Framework compliance.",
  },
];

function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function isScoredRequirementId(id: string): boolean {
  const s = /^S(\d{2})$/.exec(id);
  if (s) return inRange(Number(s[1]), 1, 4);

  const dm = /^DM(\d{2})$/.exec(id);
  if (dm) return inRange(Number(dm[1]), 1, 8);

  const sd = /^SD(\d{2})$/.exec(id);
  if (sd) return inRange(Number(sd[1]), 1, 12);

  const t = /^T(\d{2})$/.exec(id);
  if (t) return inRange(Number(t[1]), 1, 3);

  const nf = /^NF(\d{2})$/.exec(id);
  if (nf) return inRange(Number(nf[1]), 1, 6);

  const ru = /^RU(\d{2})$/.exec(id);
  if (ru) return inRange(Number(ru[1]), 1, 3);

  const d = /^D(\d{2})$/.exec(id);
  if (d) return inRange(Number(d[1]), 1, 3);

  return false;
}

export const SCORED_REQUIREMENTS = SAF_REQUIREMENTS.filter((r) =>
  isScoredRequirementId(r.id)
);

export function getRequirementsByDimension(
  requirements: SAFRequirement[] = SAF_REQUIREMENTS
): Map<string, SAFRequirement[]> {
  const map = new Map<string, SAFRequirement[]>();
  for (const req of requirements) {
    const existing = map.get(req.dimension) ?? [];
    existing.push(req);
    map.set(req.dimension, existing);
  }
  return map;
}
