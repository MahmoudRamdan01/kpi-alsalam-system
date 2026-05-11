import type { Department, Employee, RecruitmentStage, Recruiter, AlertItem, ReportPeriod, KPI } from '@/types';

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const hospitalKPIs: KPI[] = [
  {
    id: 'kpi-001', name: 'Patient Satisfaction', nameAr: 'رضا المرضى', type: 'Quality', polarity: 'Higher is Better',
    formula: '(Satisfied Patients / Total Patients) × 100', unit: '%', target: 90, weight: 40,
    actual: 85, achievement: 94.4, score: 37.8, department: 'All', trend: [82, 83, 84, 85, 86, 85, 84, 85, 86, 85, 84, 85]
  },
  {
    id: 'kpi-002', name: 'Diagnosis Accuracy', nameAr: 'دقة التشخيص', type: 'Quality', polarity: 'Higher is Better',
    formula: '(Correct Diagnoses / Total Diagnoses) × 100', unit: '%', target: 95, weight: 30,
    actual: 92, achievement: 96.8, score: 29.0, department: 'Doctors', trend: [90, 91, 92, 91, 93, 92, 93, 92, 91, 92, 93, 92]
  },
  {
    id: 'kpi-003', name: 'Avg Consultation Time', nameAr: 'متوسط وقت الكشف', type: 'Efficiency', polarity: 'Lower is Better',
    formula: 'Total Consultation Time / Number of Patients', unit: 'min', target: 15, weight: 20,
    actual: 18, achievement: 83.3, score: 16.7, department: 'Doctors', trend: [20, 19, 18, 19, 18, 17, 18, 19, 18, 17, 18, 18]
  },
  {
    id: 'kpi-004', name: 'Attendance Rate', nameAr: 'نسبة الحضور', type: 'Productivity', polarity: 'Higher is Better',
    formula: '(Days Present / Working Days) × 100', unit: '%', target: 98, weight: 10,
    actual: 96, achievement: 98.0, score: 9.8, department: 'All', trend: [95, 96, 96, 97, 96, 95, 96, 97, 96, 96, 97, 96]
  },
  {
    id: 'kpi-005', name: 'Answer Rate', nameAr: 'نسبة الرد', type: 'Quality', polarity: 'Higher is Better',
    formula: '(Answered Calls / Total Calls) × 100', unit: '%', target: 95, weight: 40,
    actual: 88, achievement: 92.6, score: 37.0, department: 'Reception', trend: [85, 86, 87, 88, 87, 86, 87, 88, 89, 88, 87, 88]
  },
  {
    id: 'kpi-006', name: 'Avg Response Time', nameAr: 'متوسط وقت الرد', type: 'Efficiency', polarity: 'Lower is Better',
    formula: 'Total Wait Time / Number of Calls', unit: 'sec', target: 30, weight: 30,
    actual: 45, achievement: 66.7, score: 20.0, department: 'Reception', trend: [55, 52, 50, 48, 46, 45, 44, 45, 46, 45, 44, 45]
  },
  {
    id: 'kpi-007', name: 'Call Quality Score', nameAr: 'جودة المكالمة', type: 'Quality', polarity: 'Higher is Better',
    formula: 'Quality Evaluation Score', unit: '%', target: 90, weight: 30,
    actual: 87, achievement: 96.7, score: 29.0, department: 'Reception', trend: [84, 85, 86, 85, 86, 87, 86, 87, 88, 87, 86, 87]
  },
  {
    id: 'kpi-008', name: 'Time to Hire', nameAr: 'وقت التوظيف', type: 'Efficiency', polarity: 'Lower is Better',
    formula: 'Days from Requisition to Acceptance', unit: 'days', target: 25, weight: 40,
    actual: 32, achievement: 78.1, score: 31.2, department: 'HR', trend: [40, 38, 36, 35, 34, 33, 32, 31, 32, 33, 32, 32]
  },
  {
    id: 'kpi-009', name: 'Quality of Hire', nameAr: 'جودة التعيين', type: 'Quality', polarity: 'Higher is Better',
    formula: 'New Hire Performance Score / Target', unit: '%', target: 85, weight: 30,
    actual: 81, achievement: 95.3, score: 28.6, department: 'HR', trend: [78, 79, 80, 79, 80, 81, 80, 81, 82, 81, 80, 81]
  },
  {
    id: 'kpi-010', name: 'Retention Rate', nameAr: 'نسبة الاحتفاظ', type: 'Strategic', polarity: 'Higher is Better',
    formula: '(Employees Retained / Total Employees) × 100', unit: '%', target: 92, weight: 30,
    actual: 89, achievement: 96.7, score: 29.0, department: 'HR', trend: [86, 87, 88, 87, 88, 89, 88, 89, 90, 89, 88, 89]
  },
  {
    id: 'kpi-011', name: 'Bed Occupancy', nameAr: 'إشغال الأسرة', type: 'Productivity', polarity: 'Higher is Better',
    formula: '(Occupied Beds / Total Beds) × 100', unit: '%', target: 85, weight: 50,
    actual: 82, achievement: 96.5, score: 48.2, department: 'Nurses', trend: [78, 79, 80, 81, 82, 81, 82, 83, 82, 81, 82, 82]
  },
  {
    id: 'kpi-012', name: 'Medication Error Rate', nameAr: 'نسبة أخطاء الدواء', type: 'Quality', polarity: 'Lower is Better',
    formula: '(Errors / Total Medications) × 100', unit: '%', target: 0.5, weight: 50,
    actual: 0.8, achievement: 62.5, score: 31.2, department: 'Nurses', trend: [1.2, 1.1, 1.0, 0.9, 0.8, 0.9, 0.8, 0.7, 0.8, 0.9, 0.8, 0.8]
  },
];

export const departments: Department[] = [
  {
    id: 'dept-001', name: 'Doctors', nameAr: 'الأطباء', manager: 'Dr. Ahmed Hassan', employeeCount: 45,
    overallScore: 87.5, target: 90, status: 'Good',
    kpis: hospitalKPIs.filter(k => k.department === 'Doctors' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    monthlyTrend: [82, 83, 84, 85, 86, 85, 86, 87, 86, 87, 87, 87.5]
  },
  {
    id: 'dept-002', name: 'Nurses', nameAr: 'التمريض', manager: 'Sara Mahmoud', employeeCount: 120,
    overallScore: 79.4, target: 85, status: 'Average',
    kpis: hospitalKPIs.filter(k => k.department === 'Nurses' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    monthlyTrend: [75, 76, 77, 78, 77, 78, 79, 78, 79, 80, 79, 79.4]
  },
  {
    id: 'dept-003', name: 'Reception / Call Center', nameAr: 'الاستقبال / الكول سنتر', manager: 'Khaled Omar', employeeCount: 32,
    overallScore: 72.0, target: 85, status: 'Needs Improvement',
    kpis: hospitalKPIs.filter(k => k.department === 'Reception' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    monthlyTrend: [68, 69, 70, 69, 70, 71, 70, 71, 72, 71, 71, 72.0]
  },
  {
    id: 'dept-004', name: 'HR', nameAr: 'الموارد البشرية', manager: 'Mona Fathi', employeeCount: 18,
    overallScore: 88.8, target: 85, status: 'Excellent',
    kpis: hospitalKPIs.filter(k => k.department === 'HR'),
    monthlyTrend: [82, 83, 84, 85, 86, 87, 87, 88, 88, 88, 88, 88.8]
  },
  {
    id: 'dept-005', name: 'Recruitment', nameAr: 'التوظيف', manager: 'Omar Ibrahim', employeeCount: 12,
    overallScore: 81.5, target: 80, status: 'Good',
    kpis: hospitalKPIs.filter(k => k.department === 'HR'),
    monthlyTrend: [76, 77, 78, 79, 80, 80, 81, 81, 82, 81, 81, 81.5]
  }
];

export const employees: Employee[] = [
  {
    id: 'emp-001', name: 'Dr. Ahmed Hassan', role: 'Chief Physician', department: 'Doctors', departmentAr: 'الأطباء',
    hireDate: '2018-03-15', baseSalary: 45000, overallScore: 92.5, target: 90, status: 'Excellent',
    kpis: hospitalKPIs.filter(k => k.department === 'Doctors' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    attendance: 98, monthlyTrend: [88, 89, 90, 91, 90, 91, 92, 92, 93, 92, 92, 92.5],
    bonusEligible: true, bonusAmount: 9000
  },
  {
    id: 'emp-002', name: 'Dr. Sara Mahmoud', role: 'Senior Doctor', department: 'Doctors', departmentAr: 'الأطباء',
    hireDate: '2019-07-20', baseSalary: 38000, overallScore: 89.2, target: 90, status: 'Good',
    kpis: hospitalKPIs.filter(k => k.department === 'Doctors' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    attendance: 97, monthlyTrend: [85, 86, 87, 88, 87, 88, 89, 89, 90, 89, 89, 89.2],
    bonusEligible: true, bonusAmount: 5700
  },
  {
    id: 'emp-003', name: 'Dr. Khaled Omar', role: 'Specialist', department: 'Doctors', departmentAr: 'الأطباء',
    hireDate: '2020-01-10', baseSalary: 32000, overallScore: 85.8, target: 90, status: 'Good',
    kpis: hospitalKPIs.filter(k => k.department === 'Doctors' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    attendance: 95, monthlyTrend: [82, 83, 84, 83, 84, 85, 85, 86, 85, 86, 86, 85.8],
    bonusEligible: true, bonusAmount: 3200
  },
  {
    id: 'emp-004', name: 'Nurse Fatima Ali', role: 'Head Nurse', department: 'Nurses', departmentAr: 'التمريض',
    hireDate: '2017-05-12', baseSalary: 22000, overallScore: 84.5, target: 85, status: 'Good',
    kpis: hospitalKPIs.filter(k => k.department === 'Nurses' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    attendance: 96, monthlyTrend: [80, 81, 82, 83, 82, 83, 84, 84, 85, 84, 84, 84.5],
    bonusEligible: true, bonusAmount: 2200
  },
  {
    id: 'emp-005', name: 'Nurse Omar Ibrahim', role: 'Nurse', department: 'Nurses', departmentAr: 'التمريض',
    hireDate: '2021-02-28', baseSalary: 16000, overallScore: 78.3, target: 85, status: 'Average',
    kpis: hospitalKPIs.filter(k => k.department === 'Nurses' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    attendance: 94, monthlyTrend: [74, 75, 76, 75, 76, 77, 77, 78, 78, 78, 78, 78.3],
    bonusEligible: false, bonusAmount: 0
  },
  {
    id: 'emp-006', name: 'Nurse Layla Samir', role: 'Nurse', department: 'Nurses', departmentAr: 'التمريض',
    hireDate: '2022-08-15', baseSalary: 15000, overallScore: 72.1, target: 85, status: 'Needs Improvement',
    kpis: hospitalKPIs.filter(k => k.department === 'Nurses' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    attendance: 92, monthlyTrend: [68, 69, 70, 70, 71, 71, 72, 72, 73, 72, 72, 72.1],
    bonusEligible: false, bonusAmount: 0
  },
  {
    id: 'emp-007', name: 'Mona Fathi', role: 'Reception Manager', department: 'Reception / Call Center', departmentAr: 'الاستقبال',
    hireDate: '2019-11-01', baseSalary: 18000, overallScore: 80.2, target: 85, status: 'Good',
    kpis: hospitalKPIs.filter(k => k.department === 'Reception' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    attendance: 96, monthlyTrend: [76, 77, 78, 77, 78, 79, 79, 80, 80, 80, 80, 80.2],
    bonusEligible: true, bonusAmount: 1800
  },
  {
    id: 'emp-008', name: 'Hassan Youssef', role: 'Call Agent', department: 'Reception / Call Center', departmentAr: 'الاستقبال',
    hireDate: '2023-03-10', baseSalary: 12000, overallScore: 68.5, target: 85, status: 'Needs Improvement',
    kpis: hospitalKPIs.filter(k => k.department === 'Reception' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    attendance: 91, monthlyTrend: [62, 63, 64, 65, 65, 66, 67, 67, 68, 68, 68, 68.5],
    bonusEligible: false, bonusAmount: 0
  },
  {
    id: 'emp-009', name: 'Rania Khalil', role: 'Call Agent', department: 'Reception / Call Center', departmentAr: 'الاستقبال',
    hireDate: '2022-06-20', baseSalary: 13000, overallScore: 70.8, target: 85, status: 'Average',
    kpis: hospitalKPIs.filter(k => k.department === 'Reception' || k.id === 'kpi-001' || k.id === 'kpi-004'),
    attendance: 93, monthlyTrend: [65, 66, 67, 67, 68, 69, 69, 70, 70, 70, 70, 70.8],
    bonusEligible: false, bonusAmount: 0
  },
  {
    id: 'emp-010', name: 'Omar Ibrahim', role: 'HR Manager', department: 'HR', departmentAr: 'الموارد البشرية',
    hireDate: '2018-09-01', baseSalary: 28000, overallScore: 91.0, target: 85, status: 'Excellent',
    kpis: hospitalKPIs.filter(k => k.department === 'HR'),
    attendance: 98, monthlyTrend: [85, 86, 87, 88, 89, 89, 90, 90, 91, 91, 91, 91.0],
    bonusEligible: true, bonusAmount: 5600
  },
  {
    id: 'emp-011', name: 'Dina Samir', role: 'Recruiter', department: 'Recruitment', departmentAr: 'التوظيف',
    hireDate: '2020-04-15', baseSalary: 20000, overallScore: 82.5, target: 80, status: 'Good',
    kpis: hospitalKPIs.filter(k => k.department === 'HR'),
    attendance: 96, monthlyTrend: [76, 77, 78, 79, 80, 80, 81, 82, 82, 82, 82, 82.5],
    bonusEligible: true, bonusAmount: 2000
  },
  {
    id: 'emp-012', name: 'Tarek Mahmoud', role: 'Recruiter', department: 'Recruitment', departmentAr: 'التوظيف',
    hireDate: '2021-11-01', baseSalary: 18000, overallScore: 80.8, target: 80, status: 'Good',
    kpis: hospitalKPIs.filter(k => k.department === 'HR'),
    attendance: 95, monthlyTrend: [75, 76, 77, 78, 79, 79, 80, 80, 81, 81, 81, 80.8],
    bonusEligible: true, bonusAmount: 1440
  }
];

export const recruitmentFunnel: RecruitmentStage[] = [
  { stage: 'Applied', count: 1250, conversionRate: 100 },
  { stage: 'Screened', count: 875, conversionRate: 70 },
  { stage: 'Interview', count: 420, conversionRate: 48 },
  { stage: 'Assessment', count: 280, conversionRate: 67 },
  { stage: 'Offer', count: 180, conversionRate: 64 },
  { stage: 'Hired', count: 145, conversionRate: 81 }
];

export const recruiters: Recruiter[] = [
  { id: 'rec-001', name: 'Dina Samir', hired: 48, target: 55, timeToHire: 28, qualityScore: 84 },
  { id: 'rec-002', name: 'Tarek Mahmoud', hired: 42, target: 50, timeToHire: 30, qualityScore: 82 },
  { id: 'rec-003', name: 'Nour Hassan', hired: 55, target: 50, timeToHire: 25, qualityScore: 88 }
];

export const alerts: AlertItem[] = [
  { id: 'alert-001', type: 'danger', message: 'Call Center Answer Rate dropped below target', department: 'Reception / Call Center', metric: 'Answer Rate', value: 88, target: 95 },
  { id: 'alert-002', type: 'warning', message: 'Reception Avg Response Time exceeds threshold', department: 'Reception / Call Center', metric: 'Avg Response Time', value: 45, target: 30 },
  { id: 'alert-003', type: 'danger', message: 'Nurse Medication Error Rate above acceptable limit', department: 'Nurses', metric: 'Medication Error Rate', value: 0.8, target: 0.5 },
  { id: 'alert-004', type: 'warning', message: 'Doctor Avg Consultation Time increased', department: 'Doctors', metric: 'Avg Consultation Time', value: 18, target: 15 },
  { id: 'alert-005', type: 'info', message: 'HR Retention Rate improved significantly', department: 'HR', metric: 'Retention Rate', value: 89, target: 92 }
];

export const reportPeriods: ReportPeriod[] = [
  {
    period: 'January 2026', overallScore: 79.5,
    departmentScores: { 'Doctors': 82.0, 'Nurses': 75.0, 'Reception / Call Center': 68.0, 'HR': 82.0, 'Recruitment': 76.0 },
    topPerformers: ['Dr. Ahmed Hassan', 'Omar Ibrahim'],
    lowPerformers: ['Hassan Youssef', 'Nurse Layla Samir'],
    trends: ['Patient Satisfaction stable', 'Call Center performance declining', 'HR metrics improving'],
    variances: { 'Doctors': -8.0, 'Nurses': -10.0, 'Reception / Call Center': -17.0, 'HR': -3.0, 'Recruitment': -4.0 }
  },
  {
    period: 'February 2026', overallScore: 80.8,
    departmentScores: { 'Doctors': 83.0, 'Nurses': 76.0, 'Reception / Call Center': 69.0, 'HR': 83.0, 'Recruitment': 77.0 },
    topPerformers: ['Dr. Ahmed Hassan', 'Omar Ibrahim'],
    lowPerformers: ['Hassan Youssef', 'Nurse Layla Samir'],
    trends: ['Diagnosis Accuracy improved', 'Response time slightly better', 'Retention stable'],
    variances: { 'Doctors': -7.0, 'Nurses': -9.0, 'Reception / Call Center': -16.0, 'HR': -2.0, 'Recruitment': -3.0 }
  },
  {
    period: 'March 2026', overallScore: 81.2,
    departmentScores: { 'Doctors': 84.0, 'Nurses': 77.0, 'Reception / Call Center': 70.0, 'HR': 84.0, 'Recruitment': 78.0 },
    topPerformers: ['Dr. Ahmed Hassan', 'Dina Samir'],
    lowPerformers: ['Hassan Youssef', 'Nurse Omar Ibrahim'],
    trends: ['Patient Satisfaction trending up', 'Medication errors decreasing', 'Hiring quality improving'],
    variances: { 'Doctors': -6.0, 'Nurses': -8.0, 'Reception / Call Center': -15.0, 'HR': -1.0, 'Recruitment': -2.0 }
  }
];

export const workloadData = [
  { department: 'Doctors', workedHours: 1620, availableHours: 1800, utilization: 90.0, status: 'High Load' },
  { department: 'Nurses', workedHours: 5280, availableHours: 6000, utilization: 88.0, status: 'High Load' },
  { department: 'Reception', workedHours: 1152, availableHours: 1440, utilization: 80.0, status: 'Normal' },
  { department: 'HR', workedHours: 540, availableHours: 720, utilization: 75.0, status: 'Normal' },
  { department: 'Recruitment', workedHours: 384, availableHours: 480, utilization: 80.0, status: 'Normal' }
];
