import React, { useState } from 'react';
import { RepairRequest, RequestStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Users, AlertCircle, CheckCircle, TrendingUp, MoreVertical, Smartphone, Laptop, Tablet, Watch, Eye, Edit, Trash2, X, Save, MapPin, Calendar, DollarSign, PenTool, ClipboardList, Loader2, CheckSquare, XCircle } from 'lucide-react';

interface AdminViewProps {
  requests: RepairRequest[];
  hideCharts?: boolean;
  onUpdate?: (req: RepairRequest) => void;
  onDelete?: (reqId: string) => void;
}

// Mock Technicians for Dropdown
const MOCK_TECHNICIANS = [
  "QuickFix BD",
  "Repair Pro Dhaka",
  "Tech Solutions Ltd",
  "Rasel's Mobile Care",
  "ElectroFix Team",
  "Admin Technician"
];

type TabType = 'REQUEST' | 'ONGOING' | 'COMPLETE' | 'CANCEL';

export const AdminView: React.FC<AdminViewProps> = ({ requests, hideCharts = false, onUpdate, onDelete }) => {
  const [selectedReq, setSelectedReq] = useState<RepairRequest | null>(null);
  const [modalMode, setModalMode] = useState<'VIEW' | 'EDIT' | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('REQUEST');

  // Edit State
  const [editStatus, setEditStatus] = useState<RequestStatus>(RequestStatus.OPEN);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editTech, setEditTech] = useState<string>('');

  const openModal = (req: RepairRequest, mode: 'VIEW' | 'EDIT') => {
    setSelectedReq(req);
    setModalMode(mode);
    // Init edit state
    setEditStatus(req.status);
    const acceptedOffer = req.offers.find(o => o.technicianName); // Simplified logic
    setEditPrice(acceptedOffer ? acceptedOffer.price.toString() : '');
    setEditTech(acceptedOffer ? acceptedOffer.technicianName : '');
  };

  const handleSaveChanges = () => {
    if (selectedReq && onUpdate) {
      // In a real scenario, we would update the offers array or a specific 'assignedTechnician' field.
      // For this mock, if a technician is selected, we simulate adding/updating an offer or just tracking it locally.
      const updatedReq = { 
        ...selectedReq, 
        status: editStatus,
        // We aren't fully implementing offer management logic here, but retaining status updates.
      };
      
      // If tech is selected but no offers exist, we could mock creating one
      if (editTech && updatedReq.offers.length === 0) {
          updatedReq.offers.push({
              id: Date.now().toString(),
              technicianName: editTech,
              price: parseFloat(editPrice) || 0,
              note: "Assigned by Admin",
              timestamp: Date.now()
          });
      }

      onUpdate(updatedReq);
      setModalMode(null);
      setSelectedReq(null);
    }
  };

  const handleDelete = (reqId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this repair request?")) {
      if (onDelete) onDelete(reqId);
    }
  };

  // Stats Logic
  const totalRevenue = requests.reduce((acc, req) => {
    const acceptedOffer = req.offers.find(o => req.status !== RequestStatus.OPEN); 
    return acc + (acceptedOffer ? acceptedOffer.price : 0);
  }, 0);

  const statusData = [
    { name: 'Open', value: requests.filter(r => r.status === RequestStatus.OPEN).length },
    { name: 'In Progress', value: requests.filter(r => r.status === RequestStatus.IN_PROGRESS || r.status === RequestStatus.OFFER_ACCEPTED).length },
    { name: 'Completed', value: requests.filter(r => r.status === RequestStatus.COMPLETED).length },
  ];

  const deviceData = [
    { name: 'Smartphone', count: requests.filter(r => r.deviceType === 'Smartphone').length },
    { name: 'Laptop', count: requests.filter(r => r.deviceType === 'Laptop').length },
    { name: 'Tablet', count: requests.filter(r => r.deviceType === 'Tablet').length },
  ];

  const COLORS = ['#3B82F6', '#F59E0B', '#10B981'];

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'smartphone': return <Smartphone size={16} />;
      case 'laptop': return <Laptop size={16} />;
      case 'tablet': return <Tablet size={16} />;
      default: return <Watch size={16} />;
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch(status) {
      case RequestStatus.OPEN: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RequestStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800 border-blue-200';
      case RequestStatus.OFFER_ACCEPTED: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case RequestStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
      case RequestStatus.CANCELED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter Logic for Tabs
  const filteredRequests = requests.filter(req => {
    if (!hideCharts) return true; // Show all in dashboard view (or we could limit to recent)

    switch (activeTab) {
      case 'REQUEST':
        return req.status === RequestStatus.OPEN;
      case 'ONGOING':
        return req.status === RequestStatus.IN_PROGRESS || req.status === RequestStatus.OFFER_ACCEPTED;
      case 'COMPLETE':
        return req.status === RequestStatus.COMPLETED;
      case 'CANCEL':
        return req.status === RequestStatus.CANCELED;
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      {!hideCharts && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Requests</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">{requests.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Users size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium flex items-center gap-1"><TrendingUp size={14}/> +12.5%</span>
                <span className="text-slate-400 ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Estimated Revenue</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">${totalRevenue}</h3>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <TrendingUp size={24} />
                </div>
              </div>
               <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium flex items-center gap-1"><TrendingUp size={14}/> +8.2%</span>
                <span className="text-slate-400 ml-2">from last month</span>
              </div>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending Actions</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">{statusData[0].value}</h3>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                  <AlertCircle size={24} />
                </div>
              </div>
               <div className="mt-4 flex items-center text-sm">
                <span className="text-amber-600 font-medium">Requires attention</span>
              </div>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Completed Jobs</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">{statusData[2].value}</h3>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <CheckCircle size={24} />
                </div>
              </div>
               <div className="mt-4 flex items-center text-sm">
                <span className="text-slate-400">Total lifetime repairs</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-slate-800">Revenue & Request Trends</h3>
                 <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm text-slate-600 outline-none">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                 </select>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={deviceData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Request Status</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px'}} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TABS (Only shown in full list view) */}
      {hideCharts && (
        <div className="flex gap-2 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('REQUEST')}
            className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'REQUEST' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <ClipboardList size={16} /> Request
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs">
              {requests.filter(r => r.status === RequestStatus.OPEN).length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('ONGOING')}
            className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'ONGOING' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Loader2 size={16} className={activeTab === 'ONGOING' ? 'animate-spin' : ''}/> Ongoing
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs">
              {requests.filter(r => r.status === RequestStatus.IN_PROGRESS || r.status === RequestStatus.OFFER_ACCEPTED).length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('COMPLETE')}
            className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'COMPLETE' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <CheckSquare size={16} /> Complete
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs">
              {requests.filter(r => r.status === RequestStatus.COMPLETED).length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('CANCEL')}
            className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'CANCEL' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <XCircle size={16} /> Cancel
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs">
              {requests.filter(r => r.status === RequestStatus.CANCELED).length}
            </span>
          </button>
        </div>
      )}

      {/* Activity Table */}
      <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${hideCharts ? '' : 'mt-8'}`}>
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
           <h3 className="text-lg font-bold text-slate-800">
             {hideCharts ? `${activeTab.charAt(0) + activeTab.slice(1).toLowerCase()} List` : 'Recent Requests'}
           </h3>
           {!hideCharts && (
             <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
           )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Device Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    #{req.id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="font-medium text-slate-900">{req.customerName}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10}/> {req.location}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                       <span className="p-1.5 bg-slate-100 rounded-md text-slate-500">
                         {getDeviceIcon(req.deviceType)}
                       </span>
                       <div>
                         <div className="font-medium text-slate-800">{req.brand} {req.model}</div>
                         <div className="text-xs text-slate-400 truncate max-w-[150px]">{req.issueDescription}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </td>
                   <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {/* 3 ACTIONS IMPLEMENTED HERE */}
                       <button 
                         onClick={() => openModal(req, 'VIEW')}
                         className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                         title="View Details"
                        >
                         <Eye size={18} />
                       </button>
                       <button 
                         onClick={() => openModal(req, 'EDIT')}
                         className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" 
                         title="Edit Request"
                        >
                         <Edit size={18} />
                       </button>
                       <button 
                         onClick={() => handleDelete(req.id)}
                         className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                         title="Delete Request"
                        >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No requests found in this section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generic Modal */}
      {modalMode && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div>
                 <h3 className="text-xl font-bold text-slate-800">
                   {modalMode === 'VIEW' ? 'Request Details' : 'Edit Request'}
                 </h3>
                 <p className="text-sm text-slate-500">ID: #{selectedReq.id}</p>
               </div>
               <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full">
                 <X size={20} />
               </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
               {/* VIEW MODE */}
               {modalMode === 'VIEW' && (
                 <div className="space-y-6">
                    <div className="flex gap-6">
                       <img src={selectedReq.image} alt="Device" className="w-32 h-32 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                       <div className="space-y-2">
                          <h4 className="text-2xl font-bold text-slate-800">{selectedReq.brand} {selectedReq.model}</h4>
                          <div className="flex flex-wrap gap-2">
                             <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-600">{selectedReq.deviceType}</span>
                             <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(selectedReq.status)}`}>{selectedReq.status}</span>
                          </div>
                          <div className="text-sm text-slate-600 flex items-center gap-1"><MapPin size={14}/> {selectedReq.location}</div>
                          <div className="text-sm text-slate-600 flex items-center gap-1"><Calendar size={14}/> {new Date(selectedReq.createdAt).toLocaleString()}</div>
                       </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                       <h5 className="font-semibold text-slate-800 mb-2">Issue Description</h5>
                       <p className="text-slate-600 text-sm">{selectedReq.issueDescription}</p>
                       {selectedReq.aiAnalysis && (
                         <div className="mt-3 pt-3 border-t border-slate-200">
                            <span className="text-xs font-bold text-indigo-600 block mb-1">AI Diagnosis:</span>
                            <p className="text-xs text-slate-500 italic">"{selectedReq.aiAnalysis}"</p>
                         </div>
                       )}
                    </div>

                    <div>
                       <h5 className="font-semibold text-slate-800 mb-3">Offers & Technicians</h5>
                       {selectedReq.offers.length > 0 ? (
                         <div className="space-y-2">
                            {selectedReq.offers.map(offer => (
                              <div key={offer.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                                 <div>
                                   <div className="font-medium text-slate-900">{offer.technicianName}</div>
                                   <div className="text-xs text-slate-500">{offer.note}</div>
                                 </div>
                                 <div className="font-bold text-green-600">${offer.price}</div>
                              </div>
                            ))}
                         </div>
                       ) : (
                         <p className="text-sm text-slate-400 italic">No offers yet.</p>
                       )}
                    </div>
                 </div>
               )}

               {/* EDIT MODE */}
               {modalMode === 'EDIT' && (
                 <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Update Status</label>
                      <select 
                        value={editStatus} 
                        onChange={(e) => setEditStatus(e.target.value as RequestStatus)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                         <option value={RequestStatus.OPEN}>Open</option>
                         <option value={RequestStatus.OFFER_ACCEPTED}>Offer Accepted (Ongoing)</option>
                         <option value={RequestStatus.IN_PROGRESS}>In Progress (Ongoing)</option>
                         <option value={RequestStatus.COMPLETED}>Completed</option>
                         <option value={RequestStatus.CANCELED}>Canceled</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Assign Technician</label>
                        <div className="relative">
                            <PenTool className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select
                              value={editTech}
                              onChange={(e) => setEditTech(e.target.value)}
                              className="w-full pl-9 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                            >
                              <option value="">Select Technician</option>
                              {MOCK_TECHNICIANS.map((tech, idx) => (
                                <option key={idx} value={tech}>{tech}</option>
                              ))}
                            </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Cost ($)</label>
                         <div className="relative">
                           <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                           <input 
                             type="number" 
                             placeholder="0.00"
                             value={editPrice}
                             onChange={(e) => setEditPrice(e.target.value)}
                             className="w-full pl-9 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                           />
                         </div>
                      </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              {modalMode === 'VIEW' ? (
                <button 
                  onClick={() => setModalMode('EDIT')}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Edit size={16} /> Edit Request
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setModalMode('VIEW')}
                    className="px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveChanges}
                    className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
