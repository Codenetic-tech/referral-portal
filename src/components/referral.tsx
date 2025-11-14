// ReferralIncentive.tsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Users, IndianRupee, Package, TrendingUp, Activity, ArrowUpRight, Download, Filter, Search, RefreshCw } from 'lucide-react';

import { 
  ReferralData, 
  ApiResponse, 
  SummaryData, 
  DateRange,
  Tab,
} from '@/utils/referral';
import {
  COLORS,
  processReferralData,
  applyQuickRange
} from '@/utils/referral';
import DateRangePicker from '@/components/ManagementReport/DateRangePicker';
import OverviewTab from '@/components/ReferralIncentive/OverviewTab';
import ClientDetailsTab from '@/components/ReferralIncentive/ClientDetailsTab';
import LedgerTab from '@/components/ReferralIncentive/LedgerTab';
import { useAuth } from '@/contexts/AuthContext';

const ReferralIncentive: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: '',
    end: ''
  });
  const [referralData, setReferralData] = useState<ReferralData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  
    // Get actual user credentials from auth context
    const clientid = user?.clientid || '';
    const token = user?.token || '';

  // Initialize with empty/zero data
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalApplications: 0,
    pendingIncentives: 0,
    paidIncentives: 0,
    totalIncentiveAmount: 0,
    tradedApplications: 0,
    eSignCompleted: 0
  });

  const [clientDetails, setClientDetails] = useState<ReferralData[]>([]);
  const [ledger, setLedger] = useState<ReferralData[]>([]);

  // Initialize default date range (start of current month to today)
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const formatDateForInput = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setDateRange({
      start: formatDateForInput(firstDayOfMonth),
      end: formatDateForInput(today)
    });
  }, []);

  // Fetch data when dateRange changes
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchReferralData();
    }
  }, [dateRange]);

  const fetchReferralData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://n8n.gopocket.in/webhook/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'getreport',
          start_date: dateRange.start,
          end_date: dateRange.end,
          clientid: user.clientid,
          token: user.token
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data: ApiResponse[] = await response.json();
      
      if (data && data[0] && data[0].message) {
        setReferralData(data[0].message);
        const processed = processReferralData(data[0].message);
        setSummaryData(processed.summary);
        setClientDetails(processed.clientDetails);
        setLedger(processed.ledger);
      } else {
        setReferralData([]);
        const processed = processReferralData([]);
        setSummaryData(processed.summary);
        setClientDetails(processed.clientDetails);
        setLedger(processed.ledger);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching referral data:', err);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'client-details', label: 'Client Details', icon: Users },
    { id: 'ledger', label: 'Ledger', icon: Package }
  ];

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Loading Incentive data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Loading Overlay */}
      {isInitialLoading && <LoadingOverlay />}

      <div className="w-full p-6">

        {/* Date Range Picker */}
        <DateRangePicker 
          dateRange={dateRange}
          setDateRange={setDateRange}
          loading={loading}
        />

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg shadow-blue-50 mb-6 border border-gray-100 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && (
            <OverviewTab 
              summaryData={summaryData}
              isInitialLoading={isInitialLoading}
              clientDetails={clientDetails}
              ledger={ledger}
            />
          )}
          {activeTab === 'client-details' && (
            <ClientDetailsTab 
              data={clientDetails}
              loading={loading}
            />
          )}
          {activeTab === 'ledger' && (
            <LedgerTab 
              data={ledger}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralIncentive;