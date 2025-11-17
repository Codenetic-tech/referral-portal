// OverviewTab.tsx
import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, IndianRupee, Package, TrendingUp, CheckCircle, Clock, Activity, ArrowUpRight, Building2 } from 'lucide-react';
import { SummaryData, ReferralData, COLORS } from '@/utils/referral';

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

  // Monthly trend data
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
      {/* Desktop View - Completely Unchanged */}
      <div className="hidden lg:block">
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
            <p className="text-2xl font-bold">{summaryData.totalApplications}</p>
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
            <p className="text-2xl font-bold">{summaryData.pendingIncentives}</p>
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
            <p className="text-2xl font-bold">{summaryData.paidIncentives}</p>
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

        {/* Desktop Charts */}
        {!isInitialLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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

      {/* Mobile View - Only Overview Content (No Tab Navigation) */}
      <div className="lg:hidden pb-20">
        {/* Quick Stats Bar */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Performance Summary</h2>
            <TrendingUp size={20} />
          </div>
          <p className="text-sm opacity-90">Real-time overview of your referrals</p>
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Activity size={16} className="text-blue-600" />
              </div>
              <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">+12.5%</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Apps</p>
            <p className="text-lg font-bold text-gray-800">{summaryData.totalApplications}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock size={16} className="text-orange-600" />
              </div>
              <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">+8.5%</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">Pending</p>
            <p className="text-lg font-bold text-gray-800">{summaryData.pendingIncentives}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle size={16} className="text-green-600" />
              </div>
              <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">+5.5%</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">Paid</p>
            <p className="text-lg font-bold text-gray-800">{summaryData.paidIncentives}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <IndianRupee size={16} className="text-purple-600" />
              </div>
              <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">+8.5%</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total ₹</p>
            <p className="text-lg font-bold text-gray-800">₹{summaryData.totalIncentiveAmount}</p>
          </div>
        </div>

        {/* Mini Charts Preview - Static without navigation */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Quick Insights</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="h-20 mx-auto mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[stageData[0]]}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={35}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill={COLORS[0]} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-600">E-Sign</p>
              <p className="text-sm font-bold">{stageData[0].value}</p>
            </div>

            <div className="text-center">
              <div className="h-20 mx-auto mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[monthlyData[monthlyData.length - 1]]}>
                    <Bar dataKey="applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-600">Current Month</p>
              <p className="text-sm font-bold">{monthlyData[monthlyData.length - 1].applications}</p>
            </div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Overall Performance</p>
              <p className="text-xs text-gray-600">Better than last month</p>
            </div>
            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
              +15.2%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;