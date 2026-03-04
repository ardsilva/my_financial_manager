"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import * as XLSX from "xlsx";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  FileText,
  Settings,
  LogOut,
  UploadCloud,
  Download,
  Mail,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
} from "lucide-react";

// Mock Data
const monthlyData = [
  { name: "Jan", entradas: 45000, saidas: 32000 },
  { name: "Fev", entradas: 52000, saidas: 38000 },
  { name: "Mar", entradas: 48000, saidas: 35000 },
  { name: "Abr", entradas: 61000, saidas: 42000 },
  { name: "Mai", entradas: 59000, saidas: 40000 },
  { name: "Jun", entradas: 65000, saidas: 45000 },
];

const employeesData = [
  {
    id: 1,
    name: "Ana Silva",
    role: "Vendedora",
    salary: 3500,
    discounts: 150,
    net: 3350,
  },
  {
    id: 2,
    name: "Carlos Santos",
    role: "Gerente",
    salary: 6000,
    discounts: 300,
    net: 5700,
  },
  {
    id: 3,
    name: "Mariana Costa",
    role: "Atendente",
    salary: 2800,
    discounts: 100,
    net: 2700,
  },
  {
    id: 4,
    name: "João Pedro",
    role: "Estoquista",
    salary: 2500,
    discounts: 50,
    net: 2450,
  },
];

export default function DashboardApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || "Erro ao fazer login");
      }
    } catch (error) {
      setLoginError("Erro de conexão. Verifique se as variáveis de ambiente estão configuradas.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
          <div className="text-center mb-8">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Gestão Integrada
            </h1>
            <p className="text-slate-500 mt-2">
              Faça login para acessar o painel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors mt-6"
            >
              {isLoading ? "Entrando..." : "Entrar no Sistema"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Os dados de acesso são validados via Google Sheets.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 flex items-center gap-3 text-white">
          <LayoutDashboard className="w-6 h-6 text-emerald-400" />
          <span className="text-lg font-bold tracking-tight">
            Gestão Integrada
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={<FileSpreadsheet size={20} />}
            label="Importar Planilhas"
            active={activeTab === "import"}
            onClick={() => setActiveTab("import")}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Folha & Pessoal"
            active={activeTab === "employees"}
            onClick={() => setActiveTab("employees")}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Relatórios"
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <NavItem
            icon={<Settings size={20} />}
            label="Configurações"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-left hover:bg-slate-800 transition-colors text-red-400 hover:text-red-300 mt-2"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-semibold text-slate-800 capitalize">
            {activeTab === "dashboard"
              ? "Visão Geral"
              : activeTab.replace("-", " ")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
            </div>
            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === "dashboard" && <DashboardView searchTerm={globalSearch} />}
          {activeTab === "import" && <ImportView />}
          {activeTab === "employees" && <EmployeesView searchTerm={globalSearch} />}
          {activeTab === "reports" && <ReportsView />}
        </div>
      </main>
    </div>
  );
}

// --- Sub-views ---

function DashboardView({ searchTerm }: { searchTerm: string }) {
  const [data, setData] = useState<any[]>(monthlyData);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter data based on search term and selected month
  const filteredData = data.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === "all" || d.name === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  // Calculate KPIs based on the filtered data (or the last available data point if filtered)
  const currentMonth = filteredData[filteredData.length - 1] || { entradas: 0, saidas: 0 };
  const previousMonth = filteredData[filteredData.length - 2] || { entradas: 0, saidas: 0 };
  
  const entradasTrend = previousMonth.entradas ? ((currentMonth.entradas - previousMonth.entradas) / previousMonth.entradas * 100).toFixed(1) : "0.0";
  const saidasTrend = previousMonth.saidas ? ((currentMonth.saidas - previousMonth.saidas) / previousMonth.saidas * 100).toFixed(1) : "0.0";
  
  const saldoLíquido = currentMonth.entradas - currentMonth.saidas;
  const prevSaldoLíquido = previousMonth.entradas - previousMonth.saidas;
  const saldoTrend = prevSaldoLíquido ? ((saldoLíquido - prevSaldoLíquido) / Math.abs(prevSaldoLíquido) * 100).toFixed(1) : "0.0";

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Carregando dados do dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex justify-end">
        <select 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
        >
          <option value="all">Todos os Meses</option>
          {data.map((d, idx) => (
            <option key={idx} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Entradas (Mês Atual)"
          value={`R$ ${currentMonth.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          trend={`${parseFloat(entradasTrend) >= 0 ? '+' : ''}${entradasTrend}%`}
          isPositive={parseFloat(entradasTrend) >= 0}
          icon={<TrendingUp className="text-emerald-500" />}
        />
        <KpiCard
          title="Saídas (Mês Atual)"
          value={`R$ ${currentMonth.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          trend={`${parseFloat(saidasTrend) >= 0 ? '+' : ''}${saidasTrend}%`}
          isPositive={parseFloat(saidasTrend) <= 0} // Saídas menores é positivo
          icon={<TrendingDown className="text-red-500" />}
        />
        <KpiCard
          title="Saldo Líquido"
          value={`R$ ${saldoLíquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          trend={`${parseFloat(saldoTrend) >= 0 ? '+' : ''}${saldoTrend}%`}
          isPositive={parseFloat(saldoTrend) >= 0}
          icon={<DollarSign className="text-blue-500" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Fluxo de Caixa Mensal
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `R$${val / 1000}k`}
                />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Legend />
                <Bar
                  dataKey="entradas"
                  name="Entradas"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="saidas"
                  name="Saídas"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Evolução do Saldo
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `R$${val / 1000}k`}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="entradas"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImportView() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to array of arrays
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Remove empty rows
      const cleanData = jsonData.filter((row: any) => row.length > 0);

      if (cleanData.length <= 1) {
        throw new Error("A planilha parece estar vazia ou só tem cabeçalho.");
      }

      // Send to API
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetSheet: "Dashboard", // For simplicity, assuming we are importing to Dashboard
          data: cleanData.slice(1) // Skip header row
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setUploadStatus({ type: 'success', message: result.message });
      } else {
        throw new Error(result.error || "Erro ao importar");
      }
    } catch (error: any) {
      console.error(error);
      setUploadStatus({ type: 'error', message: error.message || "Erro ao processar arquivo" });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <UploadCloud className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Importar Planilhas Excel
        </h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Faça upload de suas planilhas (ex: dados do Dashboard). O sistema irá processar e adicionar os dados automaticamente no Google Sheets.
        </p>

        {uploadStatus && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${uploadStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {uploadStatus.message}
          </div>
        )}

        <label className="border-2 border-dashed border-slate-300 rounded-xl p-12 hover:bg-slate-50 hover:border-emerald-400 transition-colors cursor-pointer block relative">
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <p className="text-slate-600 font-medium">
            {isUploading ? "Processando..." : "Clique para selecionar ou arraste os arquivos (.xlsx, .csv)"}
          </p>
        </label>
      </div>
    </div>
  );
}

function EmployeesView({ searchTerm }: { searchTerm: string }) {
  const [employees, setEmployees] = useState<any[]>(employeesData);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const [newEmp, setNewEmp] = useState({ name: "", role: "", salary: "", discounts: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setEmployees(json.data);
      }
    } catch (error) {
      console.error("Error fetching employees data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddOrEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = editingEmpId !== null;
      const method = isEdit ? "PUT" : "POST";
      const body = {
        id: editingEmpId,
        name: newEmp.name,
        role: newEmp.role,
        salary: parseFloat(newEmp.salary),
        discounts: parseFloat(newEmp.discounts || "0"),
      };

      const res = await fetch("/api/employees", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setIsAdding(false);
        setEditingEmpId(null);
        setNewEmp({ name: "", role: "", salary: "", discounts: "" });
        await fetchEmployees();
      } else {
        alert(`Erro ao ${isEdit ? 'atualizar' : 'adicionar'} funcionário.`);
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (emp: any) => {
    setNewEmp({
      name: emp.name,
      role: emp.role,
      salary: emp.salary.toString(),
      discounts: emp.discounts.toString(),
    });
    setEditingEmpId(emp.id);
    setIsAdding(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return;
    
    try {
      const res = await fetch("/api/employees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchEmployees();
      } else {
        alert("Erro ao excluir funcionário.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Carregando dados de funcionários...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
      {isAdding && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{editingEmpId ? "Editar Funcionário" : "Novo Funcionário"}</h3>
            <form onSubmit={handleAddOrEditEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                <input type="text" required value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cargo</label>
                <input type="text" required value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salário Base</label>
                  <input type="number" step="0.01" required value={newEmp.salary} onChange={e => setNewEmp({...newEmp, salary: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descontos</label>
                  <input type="number" step="0.01" value={newEmp.discounts} onChange={e => setNewEmp({...newEmp, discounts: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => { setIsAdding(false); setEditingEmpId(null); setNewEmp({ name: "", role: "", salary: "", discounts: "" }); }} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Folha de Pagamento & Descontos
        </h3>
        <button onClick={() => setIsAdding(true)} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors">
          + Adicionar Funcionário
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th className="p-4 font-medium">Nome</th>
              <th className="p-4 font-medium">Cargo</th>
              <th className="p-4 font-medium">Salário Base</th>
              <th className="p-4 font-medium">Descontos</th>
              <th className="p-4 font-medium">Líquido a Receber</th>
              <th className="p-4 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">{emp.name}</td>
                <td className="p-4 text-slate-600">{emp.role}</td>
                <td className="p-4 text-slate-600">
                  R$ {emp.salary.toFixed(2)}
                </td>
                <td className="p-4 text-red-500">
                  - R$ {emp.discounts.toFixed(2)}
                </td>
                <td className="p-4 font-medium text-emerald-600">
                  R$ {emp.net.toFixed(2)}
                </td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => handleEditClick(emp)} className="text-blue-600 hover:underline text-sm font-medium">
                    Editar
                  </button>
                  <button onClick={() => handleDeleteClick(emp.id)} className="text-red-600 hover:underline text-sm font-medium">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsView() {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleSendEmail = async () => {
    setIsSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "contabilidade@exemplo.com", // In a real app, this could be an input
          subject: "Relatório Financeiro e RH - Consolidação",
          body: `
            <h2>Relatório Consolidado</h2>
            <p>Olá,</p>
            <p>Os dados financeiros e de folha de pagamento foram atualizados na nossa planilha central.</p>
            <p>Por favor, acesse o Google Sheets compartilhado para verificar os detalhes do mês atual.</p>
            <br/>
            <p>Atenciosamente,<br/>Equipe de Gestão</p>
          `
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setStatus({ type: 'success', message: "Email enviado com sucesso para a contabilidade!" });
      } else {
        throw new Error(result.error || "Erro ao enviar email");
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || "Erro de conexão" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Exportação e Relatórios
        </h3>
        <p className="text-slate-600 mb-6">
          Gere relatórios consolidados a partir dos dados do dashboard e envie
          diretamente para a contabilidade.
        </p>

        {status && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {status.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-lg p-5 hover:border-emerald-500 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
              <Download className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-1">
              Exportar para Google Sheets
            </h4>
            <p className="text-sm text-slate-500">
              Os dados já estão sincronizados em tempo real com a sua planilha do Google.
            </p>
          </div>

          <div 
            onClick={isSending ? undefined : handleSendEmail}
            className={`border border-slate-200 rounded-lg p-5 transition-colors group ${isSending ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 cursor-pointer'}`}
          >
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-1">
              {isSending ? "Enviando..." : "Enviar para Contabilidade"}
            </h4>
            <p className="text-sm text-slate-500">
              Dispara um email automático via Google Apps Script avisando a contabilidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Components ---

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-left transition-colors ${
        active
          ? "bg-emerald-500/10 text-emerald-400 font-medium"
          : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function KpiCard({
  title,
  value,
  trend,
  isPositive,
  icon,
}: {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <div
          className={`flex items-center gap-1 mt-2 text-sm font-medium ${isPositive ? "text-emerald-600" : "text-red-600"}`}
        >
          <span>{trend}</span>
          <span className="text-slate-400 font-normal ml-1">
            vs mês anterior
          </span>
        </div>
      </div>
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}
