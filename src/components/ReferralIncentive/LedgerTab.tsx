// LedgerTab.tsx
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Search, Filter, Download, IndianRupee } from 'lucide-react';
import { ReferralData } from '@/utils/referral';

interface LedgerTabProps {
  data: ReferralData[];
  loading: boolean;
}

const LedgerTab: React.FC<LedgerTabProps> = ({ data, loading }) => {
  const columns: ColumnDef<ReferralData>[] = [
    {
      accessorKey: 'application_no',
      header: 'Application No',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue('application_no')}
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Application Date',
      cell: ({ row }) => (
        <div className="text-gray-600">
          {new Date(row.getValue('date')).toLocaleDateString('en-IN')}
        </div>
      ),
    },
    {
      accessorKey: 'masked_mobile',
      header: 'Mobile',
      cell: ({ row }) => (
        <div className="text-gray-600">
          {row.getValue('masked_mobile')}
        </div>
      ),
    },
    {
      accessorKey: 'stage',
      header: 'Stage',
      cell: ({ row }) => {
        const stage = row.getValue('stage') as string;
        let bgColor = 'bg-gray-100 text-gray-800';
        
        if (stage === 'E sign') bgColor = 'bg-blue-100 text-blue-800';
        if (stage === 'Nominee') bgColor = 'bg-green-100 text-green-800';
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
            {stage}
          </span>
        );
      },
    },
    {
      accessorKey: 'trade',
      header: 'Traded',
      cell: ({ row }) => {
        const traded = row.getValue('trade') === 'TRUE';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            traded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {traded ? 'Yes' : 'No'}
          </span>
        );
      },
    },
    {
      accessorKey: 'incentive_paid_date',
      header: 'Paid Date',
      cell: ({ row }) => (
        <div className="text-gray-600">
          {row.getValue('incentive_paid_date') 
            ? new Date(row.getValue('incentive_paid_date')).toLocaleDateString('en-IN')
            : '-'
          }
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="font-semibold text-green-600 flex items-center gap-1">
          <IndianRupee size={14} />
          {row.getValue('amount') || '0'}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Calculate total amount
  const totalAmount = data.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading ledger data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={e => table.getColumn('application_no')?.setFilterValue(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {table.getRowModel().rows.length} of {data.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {data.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <IndianRupee className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No paid incentives</h3>
          <p className="text-gray-600">No incentive payments have been processed yet.</p>
        </div>
      )}
    </div>
  );
};

export default LedgerTab;