import { useEffect } from "react";
import {
  departments as fallbackDepartments,
  employees as fallbackEmployees,
  hospitalKPIs as fallbackHospitalKPIs,
  recruitmentFunnel as fallbackRecruitmentFunnel,
  recruiters as fallbackRecruiters,
  alerts as fallbackAlerts,
  reportPeriods as fallbackReportPeriods,
  workloadData as fallbackWorkloadData,
  months as fallbackMonths,
} from "@/data/hospitalData";
import type { AlertItem, Department, Employee, KPI, Recruiter, RecruitmentStage, ReportPeriod } from "@/types";

const KPI_TYPES: KPI["type"][] = ["Quality", "Efficiency", "Productivity", "Financial", "Strategic"];
const PERF_STATUSES: Department["status"][] = ["Excellent", "Good", "Average", "Needs Improvement", "Critical"];

function coerceKpiType(value: unknown): KPI["type"] {
  const s = String(value ?? "Quality");
  return KPI_TYPES.includes(s as KPI["type"]) ? (s as KPI["type"]) : "Quality";
}

function coercePolarity(value: unknown): KPI["polarity"] {
  const s = String(value ?? "Higher is Better");
  return s === "Lower is Better" ? "Lower is Better" : "Higher is Better";
}

function coercePerfStatus(value: unknown): Department["status"] {
  const s = String(value ?? "Average");
  return PERF_STATUSES.includes(s as Department["status"]) ? (s as Department["status"]) : "Average";
}

type WorkloadItem = {
  department: string;
  workedHours: number;
  availableHours: number;
  utilization: number;
  status: string;
};

export type DashboardData = {
  months: string[];
  hospitalKPIs: KPI[];
  departments: Department[];
  employees: Employee[];
  recruitmentFunnel: RecruitmentStage[];
  recruiters: Recruiter[];
  alerts: AlertItem[];
  reportPeriods: ReportPeriod[];
  workloadData: WorkloadItem[];
};

const fallbackData: DashboardData = {
  months: fallbackMonths,
  hospitalKPIs: fallbackHospitalKPIs,
  departments: fallbackDepartments,
  employees: fallbackEmployees,
  recruitmentFunnel: fallbackRecruitmentFunnel,
  recruiters: fallbackRecruiters,
  alerts: fallbackAlerts,
  reportPeriods: fallbackReportPeriods,
  workloadData: fallbackWorkloadData,
};

let currentData: DashboardData = fallbackData;
const listeners = new Set<() => void>();

const toNumber = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toStringList = (value: unknown) =>
  String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toNumberList = (value: unknown) => toStringList(value).map((item) => toNumber(item, 0));

function notify() {
  for (const listener of listeners) listener();
}

export function getDashboardData() {
  return currentData;
}

export function subscribeDashboardData(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setDashboardData(data: DashboardData) {
  currentData = data;
  notify();
}

async function fetchSheetRows(sheetId: string, sheetName: string): Promise<Record<string, unknown>[]> {
  const url = `https://opensheet.elk.sh/${sheetId}/${encodeURIComponent(sheetName)}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${sheetName}`);
  }
  return response.json();
}

async function fetchGoogleSheetsData(sheetId: string): Promise<DashboardData> {
  const [
    monthsRows,
    kpiRows,
    departmentRows,
    employeeRows,
    recruitmentRows,
    recruiterRows,
    alertRows,
    reportRows,
    workloadRows,
  ] = await Promise.all([
    fetchSheetRows(sheetId, "months"),
    fetchSheetRows(sheetId, "kpis"),
    fetchSheetRows(sheetId, "departments"),
    fetchSheetRows(sheetId, "employees"),
    fetchSheetRows(sheetId, "recruitmentFunnel"),
    fetchSheetRows(sheetId, "recruiters"),
    fetchSheetRows(sheetId, "alerts"),
    fetchSheetRows(sheetId, "reportPeriods"),
    fetchSheetRows(sheetId, "workloadData"),
  ]);

  const months = monthsRows.map((row) => String(row.month ?? "")).filter(Boolean);

  const hospitalKPIs: KPI[] = kpiRows.map((row, index) => ({
    id: String(row.id || `kpi-${String(index + 1).padStart(3, "0")}`),
    name: String(row.name || ""),
    nameAr: String(row.nameAr || ""),
    type: coerceKpiType(row.type),
    polarity: coercePolarity(row.polarity),
    formula: String(row.formula || ""),
    unit: String(row.unit || ""),
    target: toNumber(row.target),
    weight: toNumber(row.weight),
    actual: toNumber(row.actual),
    achievement: toNumber(row.achievement),
    score: toNumber(row.score),
    department: String(row.department || "All"),
    trend: toNumberList(row.trend),
  }));

  const kpiMap = new Map(hospitalKPIs.map((kpi) => [kpi.id, kpi]));

  const departments: Department[] = departmentRows.map((row, index) => ({
    id: String(row.id || `dept-${String(index + 1).padStart(3, "0")}`),
    name: String(row.name || ""),
    nameAr: String(row.nameAr || ""),
    manager: String(row.manager || ""),
    employeeCount: toNumber(row.employeeCount),
    overallScore: toNumber(row.overallScore),
    target: toNumber(row.target),
    status: coercePerfStatus(row.status),
    kpis: toStringList(row.kpiIds).map((id) => kpiMap.get(id)).filter((item): item is KPI => Boolean(item)),
    monthlyTrend: toNumberList(row.monthlyTrend),
  }));

  const employees: Employee[] = employeeRows.map((row, index) => ({
    id: String(row.id || `emp-${String(index + 1).padStart(3, "0")}`),
    name: String(row.name || ""),
    role: String(row.role || ""),
    department: String(row.department || ""),
    departmentAr: String(row.departmentAr || ""),
    hireDate: String(row.hireDate || ""),
    baseSalary: toNumber(row.baseSalary),
    overallScore: toNumber(row.overallScore),
    target: toNumber(row.target),
    status: coercePerfStatus(row.status),
    kpis: toStringList(row.kpiIds).map((id) => kpiMap.get(id)).filter((item): item is KPI => Boolean(item)),
    attendance: toNumber(row.attendance),
    monthlyTrend: toNumberList(row.monthlyTrend),
    bonusEligible: String(row.bonusEligible || "").toLowerCase() === "true",
    bonusAmount: toNumber(row.bonusAmount),
  }));

  const recruitmentFunnel: RecruitmentStage[] = recruitmentRows.map((row) => ({
    stage: String(row.stage || ""),
    count: toNumber(row.count),
    conversionRate: toNumber(row.conversionRate),
  }));

  const recruiters: Recruiter[] = recruiterRows.map((row, index) => ({
    id: String(row.id || `rec-${String(index + 1).padStart(3, "0")}`),
    name: String(row.name || ""),
    hired: toNumber(row.hired),
    target: toNumber(row.target),
    timeToHire: toNumber(row.timeToHire),
    qualityScore: toNumber(row.qualityScore),
  }));

  const alerts: AlertItem[] = alertRows.map((row, index) => ({
    id: String(row.id || `alert-${String(index + 1).padStart(3, "0")}`),
    type: String(row.type || "info") as AlertItem["type"],
    message: String(row.message || ""),
    department: String(row.department || ""),
    metric: String(row.metric || ""),
    value: toNumber(row.value),
    target: toNumber(row.target),
  }));

  const reportPeriods: ReportPeriod[] = reportRows.map((row) => ({
    period: String(row.period || ""),
    overallScore: toNumber(row.overallScore),
    departmentScores: JSON.parse(String(row.departmentScores || "{}")) as Record<string, number>,
    topPerformers: toStringList(row.topPerformers),
    lowPerformers: toStringList(row.lowPerformers),
    trends: toStringList(row.trends),
    variances: JSON.parse(String(row.variances || "{}")) as Record<string, number>,
  }));

  const workloadData: WorkloadItem[] = workloadRows.map((row) => ({
    department: String(row.department || ""),
    workedHours: toNumber(row.workedHours),
    availableHours: toNumber(row.availableHours),
    utilization: toNumber(row.utilization),
    status: String(row.status || "Normal"),
  }));

  return {
    months,
    hospitalKPIs,
    departments,
    employees,
    recruitmentFunnel,
    recruiters,
    alerts,
    reportPeriods,
    workloadData,
  };
}

export function useGoogleSheetsLiveSync() {
  useEffect(() => {
    const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID as string | undefined;
    if (!sheetId) return;

    let cancelled = false;

    const sync = async () => {
      try {
        const nextData = await fetchGoogleSheetsData(sheetId);
        if (!cancelled) setDashboardData(nextData);
      } catch {
        // Keep fallback data on any fetch/parsing error.
      }
    };

    sync();
    const interval = setInterval(sync, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
}

