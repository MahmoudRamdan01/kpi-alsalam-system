import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Building2, Users, PhoneCall, Briefcase, BarChart3, Target, Award, FileText, ChevronRight, Bell, Search, Menu, X, Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, DollarSign, Percent, UserCheck, UserX, Filter, Download, ChevronDown, ChevronUp, Star, Medal, Zap, Lock, Shield, Moon, Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardData, subscribeDashboardData, useGoogleSheetsLiveSync } from '@/data/liveDashboardData';
import { BRAND } from '@/config/brand';

const COLORS = ['#0066CC', '#00A3CC', '#66C2FF', '#99D6FF', '#CCEBFF', '#E6F5FF'];
const STATUS_BG = {
  'Excellent': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  'Good': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  'Average': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  'Needs Improvement': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
  'Critical': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
};

const MENU_ITEMS = [
  { id: 'executive', label: 'Executive Dashboard', labelAr: 'لوحة التحكم التنفيذية', icon: LayoutDashboard },
  { id: 'department', label: 'Department Dashboard', labelAr: 'لوحة الأقسام', icon: Building2 },
  { id: 'employee', label: 'Employee Dashboard', labelAr: 'لوحة الموظفين', icon: Users },
  { id: 'recruitment', label: 'Recruitment Dashboard', labelAr: 'لوحة التوظيف', icon: PhoneCall },
  { id: 'workforce', label: 'Workforce Dashboard', labelAr: 'لوحة القوى العاملة', icon: Briefcase },
  { id: 'kpis', label: 'KPI Management', labelAr: 'إدارة المؤشرات', icon: Target },
  { id: 'scorecard', label: 'Scorecard System', labelAr: 'نظام البطاقات', icon: BarChart3 },
  { id: 'rewards', label: 'Rewards & Penalties', labelAr: 'المكافآت والجزاءات', icon: Award },
  { id: 'reports', label: 'Reports', labelAr: 'التقارير', icon: FileText },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="shrink-0 border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={mounted && resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {!mounted ? (
        <Moon className="h-4 w-4 opacity-50" />
      ) : resolvedTheme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}

export default function App() {
  const { alerts } = getDashboardData();
  const [activeView, setActiveView] = useState('executive');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [, setDataVersion] = useState(0);

  useEffect(() => {
    document.title = BRAND.documentTitle;
  }, []);

  useGoogleSheetsLiveSync();

  useEffect(() => {
    const unsubscribe = subscribeDashboardData(() => {
      setDataVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  const unreadAlerts = alerts.filter(a => a.type !== 'info').length;

  const renderView = () => {
    switch (activeView) {
      case 'executive': return <ExecutiveDashboard />;
      case 'department': return <DepartmentDashboard />;
      case 'employee': return <EmployeeDashboard />;
      case 'recruitment': return <RecruitmentDashboard />;
      case 'workforce': return <WorkforceDashboard />;
      case 'kpis': return <KPIManagement />;
      case 'scorecard': return <ScorecardSystem />;
      case 'rewards': return <RewardsPenalties />;
      case 'reports': return <ReportsSystem />;
      default: return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-slate-950 flex font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200" dir="ltr">
      {/* Sidebar Desktop */}
      <aside className={`hidden lg:flex flex-col bg-[#003366] text-white transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'} shadow-2xl`}>
        <div className="p-5 flex items-center justify-between">
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <img src="/logo.png" alt={BRAND.hospitalEn} className="w-10 h-10 object-contain" />
              <div>
                <h1 className="font-bold text-sm leading-tight">{BRAND.shortEn}</h1>
                <p className="text-[10px] text-blue-200">{BRAND.productEn}</p>
                <p className="text-[10px] text-blue-300/90 leading-tight mt-0.5" dir="rtl">{BRAND.hospitalAr}</p>
              </div>
            </motion.div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:bg-blue-800">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        <Separator className="bg-blue-800" />
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive ? 'bg-[#0066CC] shadow-lg' : 'hover:bg-blue-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-blue-200 group-hover:text-white'}`} />
                {sidebarOpen && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-left">
                    <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-blue-100'}`}>{item.label}</p>
                    <p className="text-[10px] text-blue-300">{item.labelAr}</p>
                  </motion.div>
                )}
                {isActive && sidebarOpen && <ChevronRight className="w-4 h-4 ml-auto text-white" />}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-blue-800">
          {sidebarOpen && (
            <div className="bg-blue-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-blue-100">System Active</span>
              </div>
              <p className="text-[10px] text-blue-300">Last sync: Just now</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#003366] text-white flex items-center justify-between p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt={BRAND.hospitalEn} className="w-8 h-8 object-contain" />
          <span className="font-bold text-sm">{BRAND.hospitalEn}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 top-16 z-40 bg-[#003366] text-white p-4 overflow-y-auto"
          >
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg mb-1 ${activeView === item.id ? 'bg-[#0066CC]' : 'hover:bg-blue-800'}`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-blue-300">{item.labelAr}</p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between sticky top-0 z-30 lg:static transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-lg font-bold text-[#003366] dark:text-sky-300">
              {MENU_ITEMS.find(m => m.id === activeView)?.label}
            </h2>
            <Badge variant="outline" className="hidden sm:inline-flex text-xs border-[#0066CC] text-[#0066CC] dark:border-sky-400 dark:text-sky-300">
              {MENU_ITEMS.find(m => m.id === activeView)?.labelAr}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 border border-transparent dark:border-slate-700">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search KPIs, employees..." className="bg-transparent text-sm outline-none w-48 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
            </div>
            <ThemeToggle />
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-300" onClick={() => setNotificationsOpen(!notificationsOpen)}>
                <Bell className="w-5 h-5" />
                {unreadAlerts > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {unreadAlerts}
                  </span>
                )}
              </Button>
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                  >
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Alerts</span>
                      <Badge variant="secondary" className="text-xs">{unreadAlerts} Unread</Badge>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {alerts.map((alert) => (
                        <div key={alert.id} className="p-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                          <div className="flex items-start gap-2">
                            {alert.type === 'danger' && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                            {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                            {alert.type === 'info' && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                            <div>
                              <p className="text-xs font-medium text-slate-800 dark:text-slate-100">{alert.message}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{alert.department}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Avatar className="w-8 h-8 border-2 border-[#0066CC]">
              <AvatarFallback className="bg-[#0066CC] text-white text-xs font-bold">AH</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto lg:mt-0 mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ────────────────────────────────────────────
   EXECUTIVE DASHBOARD
   ──────────────────────────────────────────── */
function ExecutiveDashboard() {
  const { departments, employees, alerts, months } = getDashboardData();
  const avgScore = departments.reduce((sum, d) => sum + d.overallScore, 0) / departments.length;
  const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);
  const topDept = [...departments].sort((a, b) => b.overallScore - a.overallScore)[0];
  const lowDept = [...departments].sort((a, b) => a.overallScore - b.overallScore)[0];

  const trendData = months.map((m, i) => ({
    month: m,
    overall: [78, 79, 80, 80.5, 81, 81.5, 82, 82.5, 82, 82.5, 83, 83.2][i],
    doctors: departments[0].monthlyTrend[i],
    nurses: departments[1].monthlyTrend[i],
    reception: departments[2].monthlyTrend[i],
    hr: departments[3].monthlyTrend[i],
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Hospital Score" value={`${avgScore.toFixed(1)}%`} subtitle="Target: 85%" icon={Activity} color="bg-blue-500" trend={+2.3} />
        <StatCard title="Total Employees" value={totalEmployees.toString()} subtitle="Across 5 Departments" icon={Users} color="bg-teal-500" trend={+5} />
        <StatCard title="Top Department" value={topDept.nameAr} subtitle={`${topDept.overallScore}% Score`} icon={Star} color="bg-emerald-500" trend={+1.2} />
        <StatCard title="Needs Attention" value={lowDept.nameAr} subtitle={`${lowDept.overallScore}% Score`} icon={AlertTriangle} color="bg-amber-500" trend={-1.5} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0066CC] dark:text-sky-400" />
              Hospital Performance Trends
            </CardTitle>
            <CardDescription>Monthly KPI trends by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[60, 95]} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Area type="monotone" dataKey="doctors" stroke="#0066CC" fill="#0066CC" fillOpacity={0.1} strokeWidth={2} name="Doctors" />
                <Area type="monotone" dataKey="nurses" stroke="#00A3CC" fill="#00A3CC" fillOpacity={0.1} strokeWidth={2} name="Nurses" />
                <Area type="monotone" dataKey="reception" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} strokeWidth={2} name="Reception" />
                <Area type="monotone" dataKey="hr" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} name="HR" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0066CC] dark:text-sky-400" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={departments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="overallScore"
                  nameKey="nameAr"
                >
                  {departments.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend fontSize={12} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{dept.nameAr}</span>
                  <span className={`font-bold ${dept.overallScore >= 85 ? 'text-emerald-600' : dept.overallScore >= 75 ? 'text-blue-600' : 'text-amber-600'}`}>
                    {dept.overallScore}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0066CC] dark:text-sky-400" />
              Department Score Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departments} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="nameAr" tick={{ fontSize: 11 }} width={100} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="overallScore" fill="#0066CC" radius={[0, 6, 6, 0]} name="Actual Score" />
                <Bar dataKey="target" fill="#E2E8F0" radius={[0, 6, 6, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Performance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                  alert.type === 'danger' ? 'bg-red-50 border-red-200' :
                  alert.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'
                }`}>
                  {alert.type === 'danger' && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
                  {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                  {alert.type === 'info' && <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{alert.message}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span>{alert.department}</span>
                      <span>Actual: <b>{alert.value}{alert.metric.includes('Rate') || alert.metric.includes('Accuracy') || alert.metric.includes('Satisfaction') ? '%' : ''}</b></span>
                      <span>Target: <b>{alert.target}{alert.metric.includes('Rate') || alert.metric.includes('Accuracy') || alert.metric.includes('Satisfaction') ? '%' : ''}</b></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Table */}
      <Card className="shadow-md border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Medal className="w-5 h-5 text-[#0066CC] dark:text-sky-400" />
            Top Performing Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-bold">Employee</TableHead>
                  <TableHead className="text-xs font-bold">Department</TableHead>
                  <TableHead className="text-xs font-bold">Role</TableHead>
                  <TableHead className="text-xs font-bold">Score</TableHead>
                  <TableHead className="text-xs font-bold">Target</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                  <TableHead className="text-xs font-bold">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...employees].sort((a, b) => b.overallScore - a.overallScore).slice(0, 5).map((emp) => (
                  <TableRow key={emp.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-sm">{emp.name}</TableCell>
                    <TableCell className="text-sm text-slate-600">{emp.departmentAr}</TableCell>
                    <TableCell className="text-sm text-slate-600">{emp.role}</TableCell>
                    <TableCell className="text-sm font-bold text-[#0066CC] dark:text-sky-400">{emp.overallScore}%</TableCell>
                    <TableCell className="text-sm text-slate-500">{emp.target}%</TableCell>
                    <TableCell>
                      <Badge className={`${STATUS_BG[emp.status]} text-xs`}>{emp.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Sparkline data={emp.monthlyTrend} width={80} height={30} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────────────────────────────────
   DEPARTMENT DASHBOARD
   ──────────────────────────────────────────── */
function DepartmentDashboard() {
  const { departments, months } = getDashboardData();
  const [selectedDept, setSelectedDept] = useState<string>(departments[0].id);
  const dept = departments.find(d => d.id === selectedDept) || departments[0];

  const radarData = dept.kpis.map(k => ({
    metric: k.name,
    actual: k.actual,
    target: k.target,
    fullMark: Math.max(k.target * 1.2, k.actual * 1.2)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#003366] dark:text-sky-300">Department Performance Analysis</h3>
          <p className="text-sm text-slate-500">Compare and analyze department KPIs</p>
        </div>
        <Select value={selectedDept} onValueChange={setSelectedDept}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map(d => (
              <SelectItem key={d.id} value={d.id}>{d.nameAr} - {d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dept Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Overall Score</p>
                <p className="text-2xl font-bold text-[#0066CC] dark:text-sky-400">{dept.overallScore}%</p>
                <p className="text-xs text-slate-400">Target: {dept.target}%</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dept.overallScore >= 85 ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                <Target className={`w-6 h-6 ${dept.overallScore >= 85 ? 'text-emerald-600' : 'text-amber-600'}`} />
              </div>
            </div>
            <Progress value={dept.overallScore} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Employees</p>
                <p className="text-2xl font-bold text-[#0066CC] dark:text-sky-400">{dept.employeeCount}</p>
                <p className="text-xs text-slate-400">Active staff</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Manager</p>
                <p className="text-lg font-bold text-[#0066CC] dark:text-sky-400">{dept.manager}</p>
                <p className="text-xs text-slate-400">Department Head</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{dept.nameAr} KPI Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                <Radar name="Actual" dataKey="actual" stroke="#0066CC" fill="#0066CC" fillOpacity={0.3} strokeWidth={2} />
                <Radar name="Target" dataKey="target" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={months.map((m, i) => ({ month: m, score: dept.monthlyTrend[i] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="score" stroke="#0066CC" strokeWidth={3} dot={{ r: 4, fill: '#0066CC' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* KPI Breakdown */}
      <Card className="shadow-md border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{dept.nameAr} KPI Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-bold">KPI</TableHead>
                  <TableHead className="text-xs font-bold">Type</TableHead>
                  <TableHead className="text-xs font-bold">Target</TableHead>
                  <TableHead className="text-xs font-bold">Actual</TableHead>
                  <TableHead className="text-xs font-bold">Achievement</TableHead>
                  <TableHead className="text-xs font-bold">Weight</TableHead>
                  <TableHead className="text-xs font-bold">Score</TableHead>
                  <TableHead className="text-xs font-bold">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dept.kpis.map((kpi) => (
                  <TableRow key={kpi.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{kpi.name}</p>
                        <p className="text-xs text-slate-500">{kpi.nameAr}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{kpi.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{kpi.target}{kpi.unit}</TableCell>
                    <TableCell className="text-sm">{kpi.actual}{kpi.unit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${kpi.achievement >= 100 ? 'text-emerald-600' : kpi.achievement >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>
                          {kpi.achievement.toFixed(1)}%
                        </span>
                        {kpi.achievement >= 100 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-amber-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{kpi.weight}%</TableCell>
                    <TableCell className="text-sm font-bold text-[#0066CC] dark:text-sky-400">{kpi.score.toFixed(1)}</TableCell>
                    <TableCell>
                      <Sparkline data={kpi.trend} width={60} height={24} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Department Comparison Heatmap */}
      <Card className="shadow-md border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Department KPI Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-[120px_repeat(6,1fr)] gap-1">
                <div className="text-xs font-bold text-slate-500 p-2">Department</div>
                {['Satisfaction', 'Diagnosis', 'Consultation', 'Answer Rate', 'Response Time', 'Quality'].map(h => (
                  <div key={h} className="text-xs font-bold text-slate-500 p-2 text-center">{h}</div>
                ))}
                {departments.map((d) => (
                  <>
                    <div key={`${d.id}-label`} className="text-sm font-medium p-2 bg-slate-50 rounded">{d.nameAr}</div>
                    {d.kpis.slice(0, 6).map((k) => (
                      <div key={`${d.id}-${k.id}`} className={`p-2 rounded text-center text-xs font-bold text-white ${
                        k.score >= 40 ? 'bg-emerald-500' : k.score >= 30 ? 'bg-blue-500' : k.score >= 20 ? 'bg-amber-500' : 'bg-red-500'
                      }`}>
                        {k.score.toFixed(1)}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────────────────────────────────
   EMPLOYEE DASHBOARD
   ──────────────────────────────────────────── */
function EmployeeDashboard() {
  const { employees, departments, months } = getDashboardData();
  const [selectedEmp, setSelectedEmp] = useState<string>(employees[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const emp = employees.find(e => e.id === selectedEmp) || employees[0];

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || e.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const employeeRank = [...employees].sort((a, b) => b.overallScore - a.overallScore).findIndex(e => e.id === emp.id) + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search employees..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Departments</SelectItem>
              {departments.map(d => (
                <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee List */}
        <Card className="lg:col-span-1 shadow-md border-slate-200 dark:border-slate-700 h-[500px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Employees ({filteredEmployees.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[420px]">
              <div className="space-y-1 p-3">
                {filteredEmployees.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEmp(e.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                      selectedEmp === e.id ? 'bg-[#0066CC] text-white shadow-md' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <Avatar className={`w-10 h-10 ${selectedEmp === e.id ? 'border-2 border-white' : 'border-2 border-[#0066CC]'}`}>
                      <AvatarFallback className={`text-xs font-bold ${selectedEmp === e.id ? 'bg-white text-[#0066CC] dark:text-sky-400' : 'bg-[#0066CC] text-white'}`}>
                        {e.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{e.name}</p>
                      <p className={`text-xs truncate ${selectedEmp === e.id ? 'text-blue-100' : 'text-slate-500'}`}>
                        {e.role} | {e.departmentAr}
                      </p>
                    </div>
                    <div className={`text-right ${selectedEmp === e.id ? 'text-white' : ''}`}>
                      <p className="text-sm font-bold">{e.overallScore}%</p>
                      <p className="text-[10px]">Rank #{[...employees].sort((a, b) => b.overallScore - a.overallScore).findIndex(x => x.id === e.id) + 1}</p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Employee Detail */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-md border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="w-16 h-16 border-4 border-[#0066CC]">
                  <AvatarFallback className="bg-[#0066CC] text-white text-lg font-bold">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-bold text-[#003366] dark:text-sky-300">{emp.name}</h3>
                    <Badge className={`${STATUS_BG[emp.status]}`}>{emp.status}</Badge>
                    {emp.bonusEligible && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Bonus Eligible</Badge>}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{emp.role} | {emp.departmentAr} | Hired: {emp.hireDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#0066CC] dark:text-sky-400">{emp.overallScore}%</p>
                  <p className="text-xs text-slate-500">Rank #{employeeRank} of {employees.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Attendance</p>
                  <p className="text-lg font-bold text-[#0066CC] dark:text-sky-400">{emp.attendance}%</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Base Salary</p>
                  <p className="text-lg font-bold text-[#0066CC] dark:text-sky-400">{emp.baseSalary.toLocaleString()} EGP</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Bonus</p>
                  <p className="text-lg font-bold text-emerald-600">{emp.bonusAmount.toLocaleString()} EGP</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Target</p>
                  <p className="text-lg font-bold text-slate-700">{emp.target}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee KPI Chart */}
          <Card className="shadow-md border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={months.map((m, i) => ({ month: m, score: emp.monthlyTrend[i] }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="score" stroke="#0066CC" fill="#0066CC" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* KPI Table */}
          <Card className="shadow-md border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Individual KPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="text-xs font-bold">KPI</TableHead>
                      <TableHead className="text-xs font-bold">Target</TableHead>
                      <TableHead className="text-xs font-bold">Actual</TableHead>
                      <TableHead className="text-xs font-bold">Ach %</TableHead>
                      <TableHead className="text-xs font-bold">Weight</TableHead>
                      <TableHead className="text-xs font-bold">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emp.kpis.map((kpi) => (
                      <TableRow key={kpi.id} className="hover:bg-slate-50">
                        <TableCell>
                          <p className="font-medium text-sm">{kpi.name}</p>
                          <p className="text-xs text-slate-500">{kpi.nameAr}</p>
                        </TableCell>
                        <TableCell className="text-sm">{kpi.target}{kpi.unit}</TableCell>
                        <TableCell className="text-sm font-medium">{kpi.actual}{kpi.unit}</TableCell>
                        <TableCell>
                          <span className={`text-sm font-bold ${kpi.achievement >= 100 ? 'text-emerald-600' : kpi.achievement >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>
                            {kpi.achievement.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{kpi.weight}%</TableCell>
                        <TableCell className="text-sm font-bold text-[#0066CC] dark:text-sky-400">{kpi.score.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   RECRUITMENT DASHBOARD
   ──────────────────────────────────────────── */
function RecruitmentDashboard() {
  const { recruiters, recruitmentFunnel } = getDashboardData();
  const avgTimeToHire = recruiters.reduce((sum, r) => sum + r.timeToHire, 0) / recruiters.length;
  const totalHired = recruiters.reduce((sum, r) => sum + r.hired, 0);
  const totalTarget = recruiters.reduce((sum, r) => sum + r.target, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Hired (YTD)" value={totalHired.toString()} subtitle={`Target: ${totalTarget}`} icon={UserCheck} color="bg-emerald-500" trend={+8.2} />
        <StatCard title="Avg Time to Hire" value={`${avgTimeToHire} days`} subtitle="Target: 25 days" icon={Clock} color="bg-amber-500" trend={-3.1} />
        <StatCard title="Conversion Rate" value="11.6%" subtitle="Applied → Hired" icon={Percent} color="bg-blue-500" trend={+1.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart */}
        <Card className="shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#0066CC] dark:text-sky-400" />
              Recruitment Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recruitmentFunnel.map((stage, i) => (
                <div key={stage.stage} className="flex items-center gap-4">
                  <div className="w-24 text-xs font-medium text-slate-600">{stage.stage}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stage.conversionRate}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full rounded-full flex items-center justify-end pr-2"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        >
                          <span className="text-white text-xs font-bold">{stage.count}</span>
                        </motion.div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-12">{stage.conversionRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recruiter Performance */}
        <Card className="shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recruiter Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={recruiters}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="hired" fill="#0066CC" radius={[6, 6, 0, 0]} name="Hired" />
                <Bar dataKey="target" fill="#E2E8F0" radius={[6, 6, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recruiter Table */}
      <Card className="shadow-md border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recruiter Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-bold">Recruiter</TableHead>
                  <TableHead className="text-xs font-bold">Hired</TableHead>
                  <TableHead className="text-xs font-bold">Target</TableHead>
                  <TableHead className="text-xs font-bold">Achievement</TableHead>
                  <TableHead className="text-xs font-bold">Time to Hire</TableHead>
                  <TableHead className="text-xs font-bold">Quality Score</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recruiters.map((rec) => (
                  <TableRow key={rec.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-sm">{rec.name}</TableCell>
                    <TableCell className="text-sm">{rec.hired}</TableCell>
                    <TableCell className="text-sm">{rec.target}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={(rec.hired / rec.target) * 100} className="w-20 h-2" />
                        <span className="text-xs font-bold">{((rec.hired / rec.target) * 100).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{rec.timeToHire} days</TableCell>
                    <TableCell className="text-sm font-bold text-[#0066CC] dark:text-sky-400">{rec.qualityScore}%</TableCell>
                    <TableCell>
                      <Badge className={`${rec.hired >= rec.target ? STATUS_BG['Excellent'] : STATUS_BG['Good']}`}>
                        {rec.hired >= rec.target ? 'On Target' : 'In Progress'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────────────────────────────────
   WORKFORCE DASHBOARD
   ──────────────────────────────────────────── */
function WorkforceDashboard() {
  const { workloadData } = getDashboardData();
  const overloaded = workloadData.filter(w => w.utilization > 90);
  const underutilized = workloadData.filter(w => w.utilization < 60);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Avg Utilization" value={`${(workloadData.reduce((s, w) => s + w.utilization, 0) / workloadData.length).toFixed(1)}%`} subtitle="Hospital-wide" icon={Zap} color="bg-blue-500" trend={+2.1} />
        <StatCard title="Overloaded Depts" value={overloaded.length.toString()} subtitle={`>90% utilization`} icon={AlertTriangle} color="bg-red-500" trend={-1} />
        <StatCard title="Underutilized" value={underutilized.length.toString()} subtitle={`<60% utilization`} icon={UserX} color="bg-amber-500" trend={0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Utilization by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="utilization" fill="#0066CC" radius={[6, 6, 0, 0]} name="Utilization %">
                  {workloadData.map((w, i) => (
                    <Cell key={i} fill={w.utilization > 90 ? '#EF4444' : w.utilization > 80 ? '#0066CC' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Workload Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workloadData.map((w) => (
                <div key={w.department} className="p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#0066CC] dark:text-sky-400" />
                      <span className="font-medium text-sm">{w.department}</span>
                    </div>
                    <Badge className={`${
                      w.utilization > 90 ? 'bg-red-50 text-red-700 border-red-200' :
                      w.utilization > 80 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {w.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Worked: {w.workedHours}h</span>
                    <span>Available: {w.availableHours}h</span>
                  </div>
                  <Progress value={w.utilization} className="h-3" />
                  <p className="text-right text-xs font-bold mt-1 text-[#0066CC] dark:text-sky-400">{w.utilization.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workload Summary Table */}
      <Card className="shadow-md border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Workload Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-bold">Department</TableHead>
                  <TableHead className="text-xs font-bold">Worked Hours</TableHead>
                  <TableHead className="text-xs font-bold">Available Hours</TableHead>
                  <TableHead className="text-xs font-bold">Utilization</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                  <TableHead className="text-xs font-bold">Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workloadData.map((w) => (
                  <TableRow key={w.department} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-sm">{w.department}</TableCell>
                    <TableCell className="text-sm">{w.workedHours.toLocaleString()}h</TableCell>
                    <TableCell className="text-sm">{w.availableHours.toLocaleString()}h</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={w.utilization} className="w-20 h-2" />
                        <span className="text-xs font-bold">{w.utilization.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${
                        w.utilization > 90 ? 'bg-red-50 text-red-700 border-red-200' :
                        w.utilization > 80 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {w.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {w.utilization > 90 ? 'Consider hiring more staff' : w.utilization < 60 ? 'Redistribute workload' : 'Optimal level'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────────────────────────────────
   KPI MANAGEMENT
   ──────────────────────────────────────────── */
function KPIManagement() {
  const { hospitalKPIs } = getDashboardData();
  const [selectedType, setSelectedType] = useState('All');
  const [expandedKPI, setExpandedKPI] = useState<string | null>(null);

  const filteredKPIs = selectedType === 'All' ? hospitalKPIs : hospitalKPIs.filter(k => k.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#003366] dark:text-sky-300">KPI Definitions & Structure</h3>
          <p className="text-sm text-slate-500">Complete KPI library with formulas and weights</p>
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Quality">Quality</SelectItem>
            <SelectItem value="Efficiency">Efficiency</SelectItem>
            <SelectItem value="Productivity">Productivity</SelectItem>
            <SelectItem value="Strategic">Strategic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredKPIs.map((kpi) => (
          <Card key={kpi.id} className="shadow-md border-slate-200 dark:border-slate-700 overflow-hidden">
            <div
              className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setExpandedKPI(expandedKPI === kpi.id ? null : kpi.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    kpi.type === 'Quality' ? 'bg-emerald-100 text-emerald-600' :
                    kpi.type === 'Efficiency' ? 'bg-blue-100 text-blue-600' :
                    kpi.type === 'Productivity' ? 'bg-purple-100 text-purple-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#003366] dark:text-sky-300">{kpi.name}</h4>
                    <p className="text-xs text-slate-500">{kpi.nameAr} | {kpi.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-xs">{kpi.type}</Badge>
                  <Badge className={`${kpi.polarity === 'Higher is Better' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {kpi.polarity}
                  </Badge>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#0066CC] dark:text-sky-400">{kpi.weight}% Weight</p>
                  </div>
                  {expandedKPI === kpi.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedKPI === kpi.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-0">
                    <Separator className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Formula</p>
                        <p className="text-sm font-mono bg-white p-2 rounded border border-slate-200">{kpi.formula}</p>
                        <p className="text-xs text-slate-500 mt-2">Unit: {kpi.unit}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Targets & Weights</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Target:</span>
                            <span className="font-bold">{kpi.target}{kpi.unit}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Weight:</span>
                            <span className="font-bold">{kpi.weight}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Current Actual:</span>
                            <span className="font-bold text-[#0066CC] dark:text-sky-400">{kpi.actual}{kpi.unit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Performance</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Achievement:</span>
                            <span className={`font-bold ${kpi.achievement >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {kpi.achievement.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Score:</span>
                            <span className="font-bold text-[#0066CC] dark:text-sky-400">{kpi.score.toFixed(1)}</span>
                          </div>
                          <Progress value={kpi.achievement} className="h-2 mt-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   SCORECARD SYSTEM
   ──────────────────────────────────────────── */
function ScorecardSystem() {
  const { employees } = getDashboardData();
  const [selectedEmployee, setSelectedEmployee] = useState<string>(employees[0].id);
  const emp = employees.find(e => e.id === selectedEmployee) || employees[0];

  const totalWeight = emp.kpis.reduce((sum, k) => sum + k.weight, 0);
  const totalScore = emp.kpis.reduce((sum, k) => sum + k.score, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#003366] dark:text-sky-300">Balanced Scorecard System</h3>
          <p className="text-sm text-slate-500">Calculate and review employee performance scores</p>
        </div>
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map(e => (
              <SelectItem key={e.id} value={e.id}>{e.name} - {e.departmentAr}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Scorecard Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-md bg-[#003366] text-white">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-blue-200">Final Score</p>
            <p className="text-4xl font-bold mt-1">{totalScore.toFixed(1)}</p>
            <p className="text-xs text-blue-300 mt-1">out of {totalWeight}</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-slate-500">Achievement</p>
            <p className="text-3xl font-bold text-[#0066CC] dark:text-sky-400 mt-1">{((totalScore / totalWeight) * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-slate-500">Status</p>
            <Badge className={`mt-2 ${STATUS_BG[emp.status]}`}>{emp.status}</Badge>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-slate-500">Bonus Eligible</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{emp.bonusEligible ? 'YES' : 'NO'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Scorecard Table */}
      <Card className="shadow-md border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Detailed Scorecard: {emp.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-bold">KPI</TableHead>
                  <TableHead className="text-xs font-bold">Target</TableHead>
                  <TableHead className="text-xs font-bold">Actual</TableHead>
                  <TableHead className="text-xs font-bold">Ach %</TableHead>
                  <TableHead className="text-xs font-bold">Weight</TableHead>
                  <TableHead className="text-xs font-bold">Weighted Score</TableHead>
                  <TableHead className="text-xs font-bold">Formula</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emp.kpis.map((kpi) => (
                  <TableRow key={kpi.id} className="hover:bg-slate-50">
                    <TableCell>
                      <p className="font-medium text-sm">{kpi.name}</p>
                      <p className="text-xs text-slate-500">{kpi.nameAr}</p>
                    </TableCell>
                    <TableCell className="text-sm">{kpi.target}{kpi.unit}</TableCell>
                    <TableCell className="text-sm font-medium">{kpi.actual}{kpi.unit}</TableCell>
                    <TableCell className="text-sm font-bold">{kpi.achievement.toFixed(1)}%</TableCell>
                    <TableCell className="text-sm">{kpi.weight}%</TableCell>
                    <TableCell className="text-sm font-bold text-[#0066CC] dark:text-sky-400">{kpi.score.toFixed(1)}</TableCell>
                    <TableCell className="text-xs text-slate-500 font-mono">Actual/Target × Weight</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-[#F0F4F8] dark:bg-slate-800 font-bold">
                  <TableCell className="text-sm">TOTAL</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-sm">{totalWeight}%</TableCell>
                  <TableCell className="text-sm text-[#0066CC] dark:text-sky-400">{totalScore.toFixed(1)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Score Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={emp.kpis}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="score"
                  nameKey="name"
                  label={({ score }) => `${score.toFixed(1)}`}
                >
                  {emp.kpis.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend fontSize={11} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Score vs Target by KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={emp.kpis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nameAr" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="score" fill="#0066CC" radius={[6, 6, 0, 0]} name="Score" />
                <Bar dataKey="weight" fill="#E2E8F0" radius={[6, 6, 0, 0]} name="Max Weight" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   REWARDS & PENALTIES
   ──────────────────────────────────────────── */
function RewardsPenalties() {
  const [calcSalary, setCalcSalary] = useState(20000);
  const [calcScore, setCalcScore] = useState(85);

  const bonusPercent = calcScore >= 90 ? 20 : calcScore >= 80 ? 10 : calcScore >= 70 ? 5 : 0;
  const bonusAmount = calcSalary * (calcScore / 100) * (bonusPercent / 100);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#003366] dark:text-sky-300">Rewards & Penalties System</h3>
        <p className="text-sm text-slate-500">Performance-based incentive structure</p>
      </div>

      {/* Rewards Table */}
      <Card className="shadow-md border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            Rewards Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-bold">Performance Score</TableHead>
                  <TableHead className="text-xs font-bold">Rating</TableHead>
                  <TableHead className="text-xs font-bold">Bonus %</TableHead>
                  <TableHead className="text-xs font-bold">Reward</TableHead>
                  <TableHead className="text-xs font-bold">Badge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-emerald-50">
                  <TableCell className="font-bold text-emerald-700">≥ 90%</TableCell>
                  <TableCell><Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Excellent</Badge></TableCell>
                  <TableCell className="font-bold text-emerald-700">20%</TableCell>
                  <TableCell className="text-sm">Full Bonus + Certificate</TableCell>
                  <TableCell><Star className="w-5 h-5 text-emerald-500 fill-emerald-500" /></TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-bold text-blue-700">80% - 89%</TableCell>
                  <TableCell><Badge className="bg-blue-100 text-blue-700 border-blue-200">Good</Badge></TableCell>
                  <TableCell className="font-bold text-blue-700">10%</TableCell>
                  <TableCell className="text-sm">Partial Bonus + Recognition</TableCell>
                  <TableCell><Star className="w-5 h-5 text-blue-500 fill-blue-500" /></TableCell>
                </TableRow>
                <TableRow className="bg-amber-50">
                  <TableCell className="font-bold text-amber-700">70% - 79%</TableCell>
                  <TableCell><Badge className="bg-amber-100 text-amber-700 border-amber-200">Average</Badge></TableCell>
                  <TableCell className="font-bold text-amber-700">5%</TableCell>
                  <TableCell className="text-sm">Minimal Bonus</TableCell>
                  <TableCell><Star className="w-5 h-5 text-amber-500 fill-amber-500" /></TableCell>
                </TableRow>
                <TableRow className="bg-orange-50">
                  <TableCell className="font-bold text-orange-700">60% - 69%</TableCell>
                  <TableCell><Badge className="bg-orange-100 text-orange-700 border-orange-200">Needs Improvement</Badge></TableCell>
                  <TableCell className="font-bold text-orange-700">0%</TableCell>
                  <TableCell className="text-sm">Warning + Training Plan</TableCell>
                  <TableCell><AlertTriangle className="w-5 h-5 text-orange-500" /></TableCell>
                </TableRow>
                <TableRow className="bg-red-50">
                  <TableCell className="font-bold text-red-700">&lt; 60%</TableCell>
                  <TableCell><Badge className="bg-red-100 text-red-700 border-red-200">Critical</Badge></TableCell>
                  <TableCell className="font-bold text-red-700">0%</TableCell>
                  <TableCell className="text-sm">Performance Improvement Plan</TableCell>
                  <TableCell><AlertTriangle className="w-5 h-5 text-red-500" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bonus Calculator */}
      <Card className="shadow-md border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#0066CC] dark:text-sky-400" />
            Bonus Calculator
          </CardTitle>
          <CardDescription>Formula: Bonus = Base Salary × Performance Score × Bonus %</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Base Salary (EGP)</label>
              <Input
                type="number"
                value={calcSalary}
                onChange={(e) => setCalcSalary(Number(e.target.value))}
                className="text-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Performance Score (%)</label>
              <Input
                type="number"
                value={calcScore}
                onChange={(e) => setCalcScore(Number(e.target.value))}
                className="text-lg"
                min={0}
                max={100}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Bonus Percentage</label>
              <div className="text-2xl font-bold text-[#0066CC] dark:text-sky-400 pt-2">{bonusPercent}%</div>
            </div>
          </div>

          <div className="bg-[#F0F4F8] dark:bg-slate-800 rounded-xl p-6 text-center">
            <p className="text-sm text-slate-500 mb-2">Calculated Bonus</p>
            <p className="text-4xl font-bold text-[#0066CC] dark:text-sky-400">{bonusAmount.toLocaleString()} EGP</p>
            <p className="text-xs text-slate-500 mt-2">
              {calcSalary.toLocaleString()} × {calcScore}% × {bonusPercent}% = {bonusAmount.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Penalties */}
      <Card className="shadow-md border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-500" />
            Penalties & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-red-200 bg-red-50">
              <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
              <h4 className="font-bold text-sm text-red-700">Formal Warning</h4>
              <p className="text-xs text-red-600 mt-1">Issued when score falls below 70% for 2 consecutive months</p>
            </div>
            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
              <FileText className="w-6 h-6 text-amber-500 mb-2" />
              <h4 className="font-bold text-sm text-amber-700">Training Plan</h4>
              <p className="text-xs text-amber-600 mt-1">Mandatory skill development program assigned</p>
            </div>
            <div className="p-4 rounded-lg border border-orange-200 bg-orange-50">
              <Target className="w-6 h-6 text-orange-500 mb-2" />
              <h4 className="font-bold text-sm text-orange-700">Performance Plan</h4>
              <p className="text-xs text-orange-600 mt-1">60-day improvement plan with weekly checkpoints</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────────────────────────────────
   REPORTS SYSTEM
   ──────────────────────────────────────────── */
function ReportsSystem() {
  const { reportPeriods } = getDashboardData();
  const [activeTab, setActiveTab] = useState('monthly');

  const report = reportPeriods[2]; // March 2026

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#003366] dark:text-sky-300">Performance Reports</h3>
          <p className="text-sm text-slate-500">Daily, Weekly, and Monthly performance reports</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <Card className="shadow-md border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Daily Monitoring Report - May 3, 2026</CardTitle>
              <CardDescription>Real-time performance snapshot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Today's Score</p>
                  <p className="text-2xl font-bold text-[#0066CC] dark:text-sky-400">83.5%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Patients Served</p>
                  <p className="text-2xl font-bold text-[#0066CC] dark:text-sky-400">342</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Avg Wait Time</p>
                  <p className="text-2xl font-bold text-amber-600">22 min</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Satisfaction</p>
                  <p className="text-2xl font-bold text-emerald-600">87%</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">Daily monitoring tracks real-time metrics for immediate intervention. Data refreshes every 15 minutes from CRM and HR systems.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <Card className="shadow-md border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Weekly Trends Report - Week 18, 2026</CardTitle>
              <CardDescription>Trend analysis for the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    { day: 'Mon', score: 81 }, { day: 'Tue', score: 82 }, { day: 'Wed', score: 83 },
                    { day: 'Thu', score: 82 }, { day: 'Fri', score: 84 }, { day: 'Sat', score: 83 }, { day: 'Sun', score: 83.5 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis domain={[75, 90]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#0066CC" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600"><TrendingUp className="w-4 h-4 inline text-emerald-500 mr-1" /> Overall score improved by 2.5% this week</p>
                <p className="text-sm text-slate-600"><TrendingDown className="w-4 h-4 inline text-amber-500 mr-1" /> Reception response time still above target</p>
                <p className="text-sm text-slate-600"><TrendingUp className="w-4 h-4 inline text-emerald-500 mr-1" /> Doctor diagnosis accuracy at 92.5% (all-time high)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6 space-y-6">
          <Card className="shadow-md border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Monthly Performance Report - {report.period}</CardTitle>
              <CardDescription>Comprehensive monthly analysis for decision making</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#003366] text-white p-5 rounded-lg text-center">
                  <p className="text-sm text-blue-200">Overall Score</p>
                  <p className="text-3xl font-bold">{report.overallScore}%</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-lg text-center">
                  <p className="text-sm text-slate-500">Top Performers</p>
                  <p className="text-xl font-bold text-emerald-600">{report.topPerformers.length}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-lg text-center">
                  <p className="text-sm text-slate-500">Needs Attention</p>
                  <p className="text-xl font-bold text-red-600">{report.lowPerformers.length}</p>
                </div>
              </div>

              <h4 className="font-bold text-sm mb-3">Department Scores</h4>
              <div className="space-y-3 mb-6">
                {Object.entries(report.departmentScores).map(([dept, score]) => (
                  <div key={dept} className="flex items-center gap-3">
                    <span className="w-32 text-sm text-slate-600">{dept}</span>
                    <Progress value={score} className="flex-1 h-3" />
                    <span className="w-12 text-sm font-bold text-right">{score}%</span>
                    <span className={`text-xs w-16 text-right ${(report.variances[dept] || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {(report.variances[dept] || 0) >= 0 ? '+' : ''}{report.variances[dept]?.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-sm mb-3">Key Trends</h4>
              <div className="space-y-2">
                {report.trends.map((trend, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Activity className="w-4 h-4 text-[#0066CC] dark:text-sky-400" />
                    <span className="text-sm text-slate-700">{trend}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-md border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-emerald-700">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report.topPerformers.map((name, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <Medal className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-800">{name}</span>
                      <Star className="w-4 h-4 text-emerald-500 ml-auto fill-emerald-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700">Needs Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report.lowPerformers.map((name, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-red-800">{name}</span>
                      <Button variant="ghost" size="sm" className="ml-auto text-red-600">Action Plan</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ────────────────────────────────────────────
   HELPER COMPONENTS
   ──────────────────────────────────────────── */
function StatCard({ title, value, subtitle, icon: Icon, color, trend }: {
  title: string; value: string; subtitle: string; icon: React.ElementType; color: string; trend: number;
}) {
  return (
    <Card className="shadow-md border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-[#003366] dark:text-sky-300 mt-1">{value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} bg-opacity-10`}>
            <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
        <div className="flex items-center gap-1 mt-3">
          {trend > 0 ? (
            <TrendingUp className="w-3 h-3 text-emerald-500" />
          ) : trend < 0 ? (
            <TrendingDown className="w-3 h-3 text-red-500" />
          ) : (
            <TrendingUp className="w-3 h-3 text-slate-400" />
          )}
          <span className={`text-xs font-bold ${trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-600' : 'text-slate-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Sparkline({ data, width = 80, height = 30 }: { data: number[]; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const isUp = data[data.length - 1] >= data[0];

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={isUp ? '#10B981' : '#F59E0B'}
        strokeWidth="2"
        points={points}
      />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * height} r="2" fill={isUp ? '#10B981' : '#F59E0B'} />
    </svg>
  );
}
