// OverviewTab.tsx
import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, IndianRupee, Package, TrendingUp, CheckCircle, Clock, Activity, ArrowUpRight, Building2 } from 'lucide-react';
import { SummaryData, ReferralData, COLORS, } from '@/utils/referral';


interface OverviewTabProps {
  summaryData: SummaryData;
  isInitialLoading: boolean;
  clientDetails: ReferralData[];
  ledger: ReferralData[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  summaryData, 
  isInitialLoading, 
  clientDetails,
  ledger
}) => {
  // Chart data for stage distribution
  const stageData = [
    { name: 'E Sign', value: clientDetails.filter(item => item.stage === 'E sign').length },
    { name: 'Nominee', value: clientDetails.filter(item => item.stage === 'Nominee').length },
    { name: 'Other', value: clientDetails.filter(item => !['E sign', 'Nominee'].includes(item.stage)).length },
  ];

  // Monthly trend data (mock - you can replace with actual date-based aggregation)
  const monthlyData = [
    { month: 'Jan', applications: 45, incentives: 12000 },
    { month: 'Feb', applications: 52, incentives: 15000 },
    { month: 'Mar', applications: 48, incentives: 13000 },
    { month: 'Apr', applications: 65, incentives: 18000 },
    { month: 'May', applications: 58, incentives: 16000 },
    { month: 'Jun', applications: 72, incentives: 22000 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-lg shadow-blue-100 p-6 text-gray-800 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-blue-500/40 group">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500 p-2 rounded-lg transition-colors duration-300 group-hover:bg-white/20 backdrop-blur-sm">
              <Activity size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              12.5%
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-80 mb-1">Total Application</h3>
          <p className="text-2xl font-bold">₹ {summaryData.totalApplications}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg shadow-blue-100 p-6 text-gray-800 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-blue-500/40 group">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500 p-2 rounded-lg transition-colors duration-300 group-hover:bg-white/20 backdrop-blur-sm">
              <Users size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              8.5%
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Pending Incentives</h3>
          <p className="text-2xl font-bold">₹ {summaryData.pendingIncentives}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg shadow-blue-100 p-6 text-gray-800 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-blue-500/40 group">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500 p-2 rounded-lg transition-colors duration-300 group-hover:bg-white/20 backdrop-blur-sm">
              <Package size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              5.5%
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Paid Incentives</h3>
          <p className="text-2xl font-bold">₹ {summaryData.paidIncentives}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg shadow-blue-100 p-6 text-gray-800 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-blue-500/40 group">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500 p-2 rounded-lg transition-colors duration-300 group-hover:bg-white/20 backdrop-blur-sm">
              <Building2 size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              8.5%
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Incentives</h3>
          <p className="text-2xl font-bold">₹ {summaryData.totalIncentiveAmount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg shadow-blue-100 p-6 text-gray-800 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-blue-500/40 group">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500 p-2 rounded-lg transition-colors duration-300 group-hover:bg-white/20 backdrop-blur-sm">
              <Building2 size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              8.5%
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Incentives</h3>
          <p className="text-2xl font-bold">₹ {summaryData.totalIncentiveAmount}</p>
        </div>

      </div>

      {/* Charts */}
      {!isInitialLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stage Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Stage Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Application Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#6366f1" name="Applications" />
                <Bar dataKey="incentives" fill="#10b981" name="Incentives (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;