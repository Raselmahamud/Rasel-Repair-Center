import React, { useState } from 'react';
import { RepairRequest, RequestStatus, Offer } from '../types';
import { MapPin, Calendar, Search, DollarSign, Send, Zap, Filter } from 'lucide-react';

interface TechnicianViewProps {
  requests: RepairRequest[];
  onSubmitOffer: (reqId: string, offer: Omit<Offer, 'id' | 'timestamp'>) => void;
}

export const TechnicianView: React.FC<TechnicianViewProps> = ({ requests, onSubmitOffer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBidId, setActiveBidId] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');

  const openRequests = requests.filter(r => 
    r.status === RequestStatus.OPEN && 
    (r.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
     r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.deviceType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBidSubmit = (reqId: string) => {
    if (!price || !note) return;
    onSubmitOffer(reqId, {
      technicianName: "Admin Technician", // Since this is admin view
      price: parseFloat(price),
      note: note
    });
    setActiveBidId(null);
    setPrice('');
    setNote('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500">
           <Zap size={20} className="text-yellow-500" />
           <span className="font-semibold text-slate-700">{openRequests.length} Active Opportunities</span>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200">
             <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 overflow-y-auto pb-6">
        {openRequests.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No open jobs at the moment.</p>
          </div>
        ) : (
          openRequests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:border-blue-300 transition-colors">
              <div className="p-5 flex gap-5">
                <div className="w-24 h-24 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                   <img src={req.image} alt="Device" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-slate-800 truncate">{req.brand} {req.model}</h3>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-semibold">{req.deviceType}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-slate-500 mb-3">
                     <span className="flex items-center gap-1"><MapPin size={12}/> {req.location}</span>
                     <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-3 bg-slate-50 p-2 rounded border border-slate-100">
                    "{req.issueDescription}"
                  </p>

                  {req.aiAnalysis && (
                    <div className="text-xs text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100 mb-3">
                      <strong>AI Hint:</strong> {req.aiAnalysis}
                    </div>
                  )}

                  {activeBidId === req.id ? (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 animate-fade-in mt-auto">
                      <div className="flex gap-2 mb-2">
                         <div className="relative flex-1">
                            <span className="absolute left-2 top-1.5 text-slate-400 text-xs">$</span>
                            <input 
                              type="number" 
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="w-full pl-5 p-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                              placeholder="Price"
                              autoFocus
                           />
                         </div>
                         <input 
                            type="text" 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="flex-[2] p-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Note..."
                         />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleBidSubmit(req.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs font-semibold"
                        >
                          Submit Bid
                        </button>
                        <button 
                          onClick={() => setActiveBidId(null)}
                          className="px-3 bg-white border hover:bg-slate-50 text-slate-600 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-50">
                      <div className="text-xs text-slate-400 font-medium">
                        {req.offers.length} offers placed
                      </div>
                      <button 
                        onClick={() => setActiveBidId(req.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <DollarSign size={16} /> Bid
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
