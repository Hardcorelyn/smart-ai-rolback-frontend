import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';

// --- API and Auth Helpers ---
const API_BASE = 'https://rollback.kingscode.dev/api/v1';
const getAccessToken = () => localStorage.getItem('accessToken') || '';

// --- Logging Utility ---
const logAuditEvent = async (logEntry) => {
  try {
    const storedLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    storedLogs.push(logEntry);
    localStorage.setItem('auditLogs', JSON.stringify(storedLogs));
  } catch (error) {
    console.error("Failed to save audit log:", error);
  }
};

const initialProcesses = [
  { id: 'ECCB', process: 'AIRTIME', status: 'Running', version: 2, lastRollback: '05/10/2025 @ 10:00 AM', history: [ { version: 1, action: 'Initial Deployment', timestamp: '01/10/2025 @ 9:00 AM', status: 'Completed' }, { version: 2, action: 'Feature Update', timestamp: '04/10/2025 @ 11:00 AM', status: 'Running' }, { version: 1, action: 'Rolled Back to Version 1', timestamp: '05/10/2025 @ 10:00 AM', status: 'Running' }, { version: 2, action: 'Redeployed Version 2', timestamp: '06/10/2025 @ 3:00 PM', status: 'Running' } ] },
  { id: 'C81E', process: 'TRANSFERS', status: 'Running', version: 3, lastRollback: 'N/A', history: [ { version: 1, action: 'Initial Deployment', timestamp: '02/10/2025 @ 1:00 PM', status: 'Completed' }, { version: 2, action: 'Performance Patch', timestamp: '05/10/2025 @ 4:00 PM', status: 'Completed' }, { version: 3, action: 'New Bank Integration', timestamp: '08/10/2025 @ 9:00 AM', status: 'Running' } ] },
  { id: 'C4CA', process: 'LOGIN', status: 'Failed', version: 3, lastRollback: '09/10/2025 @ 10:05 AM', history: [ { version: 3, action: 'Initial Deployment', timestamp: '03/10/2025 @ 11:00 AM', status: 'Completed' }, { version: 4, action: 'Biometric Auth Update', timestamp: '09/10/2025 @ 9:30 AM', status: 'Failed' }, { version: 3, action: 'Rolled Back to Version 3', timestamp: '09/10/2025 @ 10:05 AM', status: 'Running' } ] },
  { id: 'A87F', process: 'BILLS', status: 'Completed', version: 2, lastRollback: 'N/A', history: [ { version: 1, action: 'Initial Deployment', timestamp: '28/09/2025 @ 9:30 AM', status: 'Completed' }, { version: 2, action: 'Add New Biller', timestamp: '07/10/2025 @ 2:00 PM', status: 'Completed' } ] },
  { id: '3F9A', process: 'PAYMENT_GATEWAY', status: 'Running', version: 4, lastRollback: '08/10/2025 @ 5:00 PM', history: [ { version: 4, action: 'Security Update', timestamp: '06/10/2025 @ 1:20 PM', status: 'Completed' }, { version: 5, action: 'Add Support for New Card', timestamp: '08/10/2025 @ 4:45 PM', status: 'Failed' }, { version: 4, action: 'Rolled Back to Version 4', timestamp: '08/10/2025 @ 5:00 PM', status: 'Running' } ] },
  { id: 'B21C', process: 'NOTIFICATIONS', status: 'Completed', version: 2, lastRollback: 'N/A', history: [ { version: 1, action: 'Initial Deployment', timestamp: '04/10/2025 @ 6:00 PM', status: 'Completed' }, { version: 2, action: 'Add Push Notification Template', timestamp: '07/10/2025 @ 11:00 AM', status: 'Completed' } ] },
  { id: 'D45F', process: 'LOAN_APPLICATION', status: 'Failed', version: 1, lastRollback: 'N/A', history: [ { version: 1, action: 'Initial Deployment', timestamp: '09/10/2025 @ 8:15 AM', status: 'Failed' } ] },
  { id: '9B8D', process: 'CARD_SERVICES', status: 'Running', version: 3, lastRollback: 'N/A', history: [ { version: 1, action: 'Initial Deployment', timestamp: '01/10/2025 @ 3:00 PM', status: 'Completed' }, { version: 2, action: 'Virtual Card Feature', timestamp: '04/10/2025 @ 5:00 PM', status: 'Completed' }, { version: 3, action: 'Contactless Activation', timestamp: '08/10/2025 @ 12:00 PM', status: 'Running' } ] },
  { id: '1A2B', process: 'ACCOUNT_OPENING', status: 'Completed', version: 2, lastRollback: 'N/A', history: [ { version: 1, action: 'Initial Deployment', timestamp: '02/10/2025 @ 10:00 AM', status: 'Completed' }, { version: 2, action: 'BVN Validation Update', timestamp: '06/10/2025 @ 1:00 PM', status: 'Completed' } ] },
  { id: '6C7D', process: 'FX_TRADING', status: 'Running', version: 1, lastRollback: 'N/A', history: [ { version: 1, action: 'Initial Deployment', timestamp: '07/10/2025 @ 4:30 PM', status: 'Running' } ] },
  { id: '8E9F', process: 'STATEMENTS', status: 'Failed', version: 2, lastRollback: '09/10/2025 @ 10:20 AM', history: [ { version: 1, action: 'Initial Deployment', timestamp: '03/10/2025 @ 2:00 PM', status: 'Completed' }, { version: 2, action: 'PDF Generation Update', timestamp: '09/10/2025 @ 10:15 AM', status: 'Failed' }, { version: 1, action: 'Rolled Back to Version 1', timestamp: '09/10/2025 @ 10:20 AM', status: 'Running' } ] },
  { id: '4G5H', process: 'SECURITY_ALERTS', status: 'Running', version: 3, lastRollback: 'N/A', history: [ { version: 2, action: 'Initial Deployment', timestamp: '05/10/2025 @ 1:00 PM', status: 'Completed' }, { version: 3, action: 'Add Geolocation Alert', timestamp: '08/10/2025 @ 3:00 PM', status: 'Running' } ] },
  { id: '2I3J', process: 'CUSTOMER_SUPPORT_BOT', status: 'Completed', version: 1, lastRollback: 'N/A', history: [ { version: 1, action: 'Initial Deployment', timestamp: '06/10/2025 @ 11:00 AM', status: 'Completed' } ] },
  { id: '0K1L', process: 'MOBILE_TOPUP', status: 'Running', version: 2, lastRollback: 'N/A', history: [ { version: 1, action: 'Initial Deployment', timestamp: '02/10/2025 @ 4:00 PM', status: 'Completed' }, { version: 2, action: 'Add New Telco Provider', timestamp: '09/10/2025 @ 9:00 AM', status: 'Running' } ] },
];

const generateChartData = (processes) => {
    const today = new Date('2025-10-09T12:00:00Z');
    const dateMap = new Map();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayKey = date.toLocaleDateString('en-CA');
        dateMap.set(dayKey, { name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), Running: 0, Failed: 0, Completed: 0 });
    }
    processes.forEach(proc => {
        proc.history.forEach(event => {
            const [day, month, year] = event.timestamp.split(' @')[0].split('/');
            const eventDate = new Date(`${year}-${month}-${day}T12:00:00Z`);
            const dayKey = eventDate.toLocaleDateString('en-CA');
            if (dateMap.has(dayKey)) dateMap.get(dayKey)[event.status]++;
        });
    });
    return Array.from(dateMap.values());
};

const getStatusChip = (status) => {
    switch (status) {
        case 'Running': return "text-green-700 bg-green-100";
        case 'Failed': return "text-red-700 bg-red-100";
        case 'Completed': return "text-blue-700 bg-blue-100";
        default: return "text-zinc-700 bg-zinc-100";
    }
};

const HistoryModal = ({ process, onClose }) => {
    if (!process) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">History for {process.process} ({process.id})</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 text-2xl font-bold">&times;</button>
                </div>
                <div className="overflow-y-auto max-h-96">
                    <table className="w-full text-left">
                        <thead><tr className="border-b"><th className="p-3 text-sm font-semibold text-zinc-500">Version</th><th className="p-3 text-sm font-semibold text-zinc-500">Action</th><th className="p-3 text-sm font-semibold text-zinc-500">Status</th><th className="p-3 text-sm font-semibold text-zinc-500">Timestamp</th></tr></thead>
                        <tbody>{process.history.slice().reverse().map((entry, index) => (<tr key={index} className="border-b hover:bg-zinc-50"><td className="p-3 font-medium">v{entry.version}</td><td className="p-3">{entry.action}</td><td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChip(entry.status)}`}>{entry.status}</span></td><td className="p-3 text-sm text-zinc-500">{entry.timestamp}</td></tr>))}</tbody>
                    </table>
                </div>
                <div className="text-right mt-4"><button onClick={onClose} className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 rounded-md">Close</button></div>
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-center gap-2">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 rounded hover:bg-zinc-200 disabled:opacity-50">&laquo;</button>
            {pageNumbers.map(number => (
                <button key={number} onClick={() => onPageChange(number)} className={`px-3 py-1 rounded ${currentPage === number ? 'bg-orange-500 text-white' : 'hover:bg-zinc-200'}`}>{number}</button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 rounded hover:bg-zinc-200 disabled:opacity-50">&raquo;</button>
        </div>
    );
};

const Dashboard = () => {
    const [processes, setProcesses] = useState(initialProcesses);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const processesPerPage = 5;

    const chartData = useMemo(() => generateChartData(processes), [processes]);

    const indexOfLastProcess = currentPage * processesPerPage;
    const indexOfFirstProcess = indexOfLastProcess - processesPerPage;
    const currentProcesses = processes.slice(indexOfFirstProcess, indexOfLastProcess);
    const totalPages = Math.ceil(processes.length / processesPerPage);

    const handleRollback = async (processId) => {
        const processToRollback = processes.find(p => p.id === processId);
        if (!processToRollback || processToRollback.version <= 1) return;

        let adminUsername = 'Unknown';
        try {
            const res = await fetch(`${API_BASE}/users/me`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` }
            });
            const data = await res.json();
            if (res.ok && data.user) {
                adminUsername = data.user.username;
            } else {
                toast.error('Could not verify admin user. Logging as "Unknown".');
            }
        } catch {
            toast.error('Network error fetching admin user. Logging as "Unknown".');
        }

        const oldVersion = processToRollback.version;
        const newVersion = oldVersion - 1;
        const timestamp = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos', day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).replace(',', ' @');

        await logAuditEvent({
            admin: adminUsername,
            action: `Rolled back from v${oldVersion} to v${newVersion}`,
            process: processToRollback.process,
            timestamp,
        });

        setProcesses(prevProcesses => {
            return prevProcesses.map(p => {
                if (p.id === processId) {
                    const newHistoryEntry = { version: newVersion, action: `Rolled Back to Version ${newVersion}`, timestamp, status: 'Running' };
                    return { ...p, version: newVersion, status: 'Running', lastRollback: timestamp, history: [...p.history, newHistoryEntry] };
                }
                return p;
            });
        });

        toast.success(`Rolled back ${processToRollback.process} to v${newVersion}`);
    };

    const handleViewHistory = (process) => {
        setSelectedProcess(process);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProcess(null);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-semibold text-zinc-800 mb-4">Banking Processes And Activities</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-200">
                                <th className="p-3 text-sm font-semibold text-zinc-500">Process ID</th>
                                <th className="p-3 text-sm font-semibold text-zinc-500">Process</th>
                                <th className="p-3 text-sm font-semibold text-zinc-500">Status</th>
                                <th className="p-3 text-sm font-semibold text-zinc-500">Current State</th>
                                <th className="p-3 text-sm font-semibold text-zinc-500">Roll Back / Revert</th>
                                <th className="p-3 text-sm font-semibold text-zinc-500">History</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProcesses.map((item) => (
                                <tr key={item.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                                    <td className="p-3 font-medium text-zinc-700">{item.id}</td>
                                    <td className="p-3 text-zinc-600">{item.process}</td>
                                    <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChip(item.status)}`}>{item.status}</span></td>
                                    <td className="p-3 text-zinc-600">
                                        <div>Running Version {item.version}</div>
                                        <div className="text-xs text-zinc-400">Last Rollback: {item.lastRollback}</div>
                                    </td>
                                    <td className="p-3 cursor-pointer" onClick={() => item.version > 1 && handleRollback(item.id)}>
                                        <button disabled={item.version <= 1} className="font-semibold text-orange-500 hover:underline disabled:text-zinc-400 disabled:no-underline disabled:cursor-not-allowed">
                                            Rollback to v{item.version - 1}
                                        </button>
                                    </td>
                                    <td className="p-3 cursor-pointer" onClick={() => handleViewHistory(item)}>
                                        <button className="font-semibold text-blue-500 hover:underline cursor-pointer">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-zinc-500">
                    <p>Showing {indexOfFirstProcess + 1} to {Math.min(indexOfLastProcess, processes.length)} of {processes.length} entries</p>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-800 mb-4">Deployment Health Overview (Last 7 Days)</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Completed" fill="#3b82f6" />
                            <Bar dataKey="Running" fill="#16a34a" />
                            <Bar dataKey="Failed" fill="#dc2626" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <HistoryModal process={selectedProcess} onClose={closeModal} />
        </>
    );
};

export default Dashboard;