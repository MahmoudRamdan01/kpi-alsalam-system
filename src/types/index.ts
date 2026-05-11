export interface KPI {
  id: string;
  name: string;
  nameAr: string;
  type: 'Quality' | 'Efficiency' | 'Productivity' | 'Financial' | 'Strategic';
  polarity: 'Higher is Better' | 'Lower is Better';
  formula: string;
  unit: string;
  target: number;
  weight: number;
  actual: number;
  achievement: number;
  score: number;
  department: string;
  trend: number[];
}

export interface Department {
  id: string;
  name: string;
  nameAr: string;
  manager: string;
  employeeCount: number;
  overallScore: number;
  target: number;
  status: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' | 'Critical';
  kpis: KPI[];
  monthlyTrend: number[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  departmentAr: string;
  hireDate: string;
  baseSalary: number;
  overallScore: number;
  target: number;
  status: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' | 'Critical';
  kpis: KPI[];
  attendance: number;
  monthlyTrend: number[];
  bonusEligible: boolean;
  bonusAmount: number;
}

export interface RecruitmentStage {
  stage: string;
  count: number;
  conversionRate: number;
}

export interface Recruiter {
  id: string;
  name: string;
  hired: number;
  target: number;
  timeToHire: number;
  qualityScore: number;
}

export interface AlertItem {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  department: string;
  metric: string;
  value: number;
  target: number;
}

export interface ReportPeriod {
  period: string;
  overallScore: number;
  departmentScores: { [key: string]: number };
  topPerformers: string[];
  lowPerformers: string[];
  trends: string[];
  variances: { [key: string]: number };
}
