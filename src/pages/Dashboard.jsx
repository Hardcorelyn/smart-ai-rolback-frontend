import React from 'react';

// Mock data to replicate the UI from the image
const mockProcesses = [
  { id: 'ECCB', process: 'AIRTIME', status: 'Running', rollbackState: 'Rolled Back To Version 1', on: 'On 7th April 2025 @ 08:30 PM' },
  { id: 'C81E', process: 'TRANSFERS', status: 'Running', rollbackState: 'Rolled Back To Version 1', on: 'On 7th April 2025 @ 08:30 PM' },
  { id: 'C4CA', process: 'LOGIN', status: 'Running', rollbackState: 'Rolled Back To Version 1', on: 'On 7th April 2025 @ 08:30 PM' },
  { id: 'A87F', process: 'BILLS', status: 'Running', rollbackState: 'Rolled Back To Version 1', on: 'On 7th April 2025 @ 08:30 PM' },
];

const Dashboard = () => {
  return (
    <>
      {/* Banking Processes Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-zinc-800 mb-4">Banking Processes And Activities</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="p-3 text-sm font-semibold text-zinc-500">Process ID</th>
                <th className="p-3 text-sm font-semibold text-zinc-500">Processes</th>
                <th className="p-3 text-sm font-semibold text-zinc-500">Status</th>
                <th className="p-3 text-sm font-semibold text-zinc-500">Rollback State</th>
                <th className="p-3 text-sm font-semibold text-zinc-500">Roll Back / Revert</th>
                <th className="p-3 text-sm font-semibold text-zinc-500">History</th>
              </tr>
            </thead>
            <tbody>
              {mockProcesses.map((item) => (
                <tr key={item.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                  <td className="p-3 font-medium text-zinc-700">{item.id}</td>
                  <td className="p-3 text-zinc-600">{item.process}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">{item.status}</span>
                  </td>
                  <td className="p-3 text-zinc-600">
                    <div>{item.rollbackState}</div>
                    <div className="text-xs text-zinc-400">{item.on}</div>
                  </td>
                  <td className="p-3">
                    <button className="font-semibold text-orange-500 hover:underline">Perform Rollback</button>
                  </td>
                  <td className="p-3">
                    <button className="font-semibold text-blue-500 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4 text-sm text-zinc-500">
          <p>Showing 1 to 4 of 4 entries</p>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded hover:bg-zinc-200">&laquo;</button>
            <button className="px-3 py-1 rounded bg-orange-500 text-white">1</button>
            <button className="px-2 py-1 rounded hover:bg-zinc-200">&raquo;</button>
          </div>
        </div>
      </div>

      {/* Account Summary Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-zinc-800">Account Summary</h2>
          <select className="border border-zinc-300 rounded-md p-1 text-sm">
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
        <div className="h-64 bg-zinc-100 rounded-md flex items-center justify-center">
          <p className="text-zinc-400">Chart will be displayed here</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;