import React, { useState } from 'react';
import { ViewState, RepairRequest, RequestStatus, Offer, Customer } from './types';
import { MOCK_REQUESTS, MOCK_CUSTOMERS } from './constants';
import { CustomerView } from './components/CustomerView';
import { TechnicianView } from './components/TechnicianView';
import { AdminView } from './components/AdminView';
import { CustomerListView } from './components/CustomerListView';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListOrdered, 
  MonitorPlay, 
  Settings, 
  Bell, 
  Search, 
  Menu,
  Wrench,
  Users
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [requests, setRequests] = useState<RepairRequest[]>(MOCK_REQUESTS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleAddRequest = (newReq: RepairRequest) => {
    setRequests(prev => [newReq, ...prev]);
    setCurrentView('REQUESTS_LIST'); // Go to list after creation
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleSubmitOffer = (reqId: string, offerData: Omit<Offer, 'id' | 'timestamp'>) => {
    setRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        const newOffer: Offer = {
          ...offerData,
          id: Date.now().toString(),
          timestamp: Date.now()
        };
        return { ...req, offers: [...req.offers, newOffer] };
      }
      return req;
    }));
  };

  const handleAcceptOffer = (reqId: string, offerId: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, status: RequestStatus.OFFER_ACCEPTED };
      }
      return req;
    }));
    alert("Offer manually accepted via Admin Console.");
  };

  // --- New Admin Functions ---
  const handleUpdateRequest = (updatedReq: RepairRequest) => {
    setRequests(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
  };

  const handleDeleteRequest = (reqId: string) => {
    setRequests(prev => prev.filter(r => r.id !== reqId));
  };
  // ---------------------------

  const SidebarItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className={`font-medium ${!sidebarOpen && 'hidden md:hidden'}`}>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl z-20`}
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-800 bg-slate-950">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
             <Wrench className="text-white" size={18} />
           </div>
           {sidebarOpen && <span className="ml-3 font-bold text-lg tracking-tight whitespace-nowrap">Rasel Repair</span>}
        </div>

        <div className="flex-1 py-6 px-3 overflow-y-auto">
          <p className={`px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 ${!sidebarOpen && 'hidden'}`}>Overview</p>
          <SidebarItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
          
          <p className={`px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-8 ${!sidebarOpen && 'hidden'}`}>Management</p>
          <SidebarItem view="REQUESTS_LIST" icon={ListOrdered} label="All Requests" />
          <SidebarItem view="CUSTOMERS" icon={Users} label="Customers" />
          <SidebarItem view="CREATE_TICKET" icon={PlusCircle} label="Create Ticket" />
          
          <p className={`px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-8 ${!sidebarOpen && 'hidden'}`}>Live Monitor</p>
          <SidebarItem view="JOB_BOARD" icon={MonitorPlay} label="Technician Board" />
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <button className="flex items-center gap-3 text-slate-400 hover:text-white w-full transition-colors">
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search request ID, brand..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-64 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-800">Admin User</div>
                <div className="text-xs text-slate-500">Super Admin</div>
              </div>
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          <div className="max-w-7xl mx-auto h-full">
            {currentView === 'DASHBOARD' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-end">
                   <div>
                     <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                     <p className="text-slate-500">Welcome back, here's what's happening at Rasel Repair Center.</p>
                   </div>
                </div>
                <AdminView 
                  requests={requests} 
                  onUpdate={handleUpdateRequest}
                  onDelete={handleDeleteRequest}
                />
              </div>
            )}

            {currentView === 'REQUESTS_LIST' && (
              <div className="animate-fade-in h-full flex flex-col">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">Repair Requests</h1>
                    <p className="text-slate-500">Manage all customer issues, view details, and update status.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('CREATE_TICKET')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                  >
                    <PlusCircle size={20} />
                    Add Repair Request
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                   <AdminView 
                    requests={requests} 
                    hideCharts={true}
                    onUpdate={handleUpdateRequest}
                    onDelete={handleDeleteRequest}
                  />
                </div>
              </div>
            )}

            {currentView === 'CUSTOMERS' && (
              <div className="animate-fade-in h-full">
                <CustomerListView 
                  customers={customers} 
                  onAddCustomer={handleAddCustomer} 
                />
              </div>
            )}

            {currentView === 'CREATE_TICKET' && (
              <div className="animate-fade-in max-w-3xl mx-auto">
                 <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Create New Ticket</h1>
                    <p className="text-slate-500">Log a new repair job for a walk-in customer or phone request.</p>
                 </div>
                 <CustomerView 
                   requests={requests} 
                   onRequestAdd={handleAddRequest} 
                   onAcceptOffer={handleAcceptOffer}
                   adminMode={true} 
                 />
              </div>
            )}

            {currentView === 'JOB_BOARD' && (
              <div className="animate-fade-in h-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Technician Job Board</h1>
                    <p className="text-slate-500">Live view of the technician marketplace.</p>
                 </div>
                <TechnicianView 
                  requests={requests} 
                  onSubmitOffer={handleSubmitOffer} 
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;