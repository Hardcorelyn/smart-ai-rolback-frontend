import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    setLogs(storedLogs.reverse()); // Show newest logs first
  }, []);

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      localStorage.removeItem('auditLogs');
      setLogs([]);
      toast.success('Audit logs cleared successfully!');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Audit Logs</h1>
        {logs.length > 0 && (
          <button
            onClick={handleClearLogs}
            className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors"
          >
            Clear Logs
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        {logs.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="p-3 text-sm font-semibold text-zinc-500">Admin</th>
                <th className="p-3 text-sm font-semibold text-zinc-500">Action</th>
                <th className="p-3 text-sm font-semibold text-zinc-500">Process</th>
                <th className="p-3 text-sm font-semibold text-zinc-500">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-b border-zinc-200 hover:bg-zinc-50">
                  <td className="p-3 font-medium text-zinc-700">{log.admin}</td>
                  <td className="p-3 text-zinc-600">{log.action}</td>
                  <td className="p-3 text-zinc-600">{log.process}</td>
                  <td className="p-3 text-sm text-zinc-500">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10">
            <p className="text-zinc-500">No audit logs found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;