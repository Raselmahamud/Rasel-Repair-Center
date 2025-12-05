import React, { useState } from 'react';
import { RepairRequest, ServiceType, RequestStatus, Offer } from '../types';
import { analyzeRepairIssue } from '../services/geminiService';
import { PlusCircle, MapPin, Wrench, DollarSign, Bot, Save, Smartphone, Laptop, Tablet, Watch } from 'lucide-react';

interface CustomerViewProps {
  requests: RepairRequest[];
  onRequestAdd: (req: RepairRequest) => void;
  onAcceptOffer: (reqId: string, offerId: string) => void;
  adminMode?: boolean;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ requests, onRequestAdd, onAcceptOffer, adminMode = false }) => {
  // Form State
  const [deviceType, setDeviceType] = useState('Smartphone');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [issue, setIssue] = useState('');
  const [location, setLocation] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.HOME_SERVICE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiPreview, setAiPreview] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!brand || !issue) return;
    setIsAnalyzing(true);
    const result = await analyzeRepairIssue(deviceType, brand, model, issue);
    setAiPreview(result);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: RepairRequest = {
      id: Date.now().toString(),
      customerName: customerName || "Walk-in Customer",
      deviceType,
      brand,
      model,
      issueDescription: issue,
      location: location || "Shop Counter",
      serviceType,
      status: RequestStatus.OPEN,
      createdAt: Date.now(),
      offers: [],
      aiAnalysis: aiPreview || undefined,
      image: `https://picsum.photos/seed/${Date.now()}/200/200`
    };
    onRequestAdd(newRequest);
    // Reset form
    setBrand('');
    setModel('');
    setIssue('');
    setLocation('');
    setCustomerName('');
    setAiPreview(null);
  };

  const DeviceOption = ({ type, icon: Icon }: { type: string, icon: any }) => (
    <div 
      onClick={() => setDeviceType(type)}
      className={`cursor-pointer rounded-xl p-4 border flex flex-col items-center gap-2 transition-all ${
        deviceType === type 
          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
      }`}
    >
      <Icon size={24} />
      <span className="text-sm font-medium">{type}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Customer & Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location / Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Area or 'Shop Counter'"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Device Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Device Information</h3>
          
          <label className="block text-sm font-medium text-slate-700">Device Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <DeviceOption type="Smartphone" icon={Smartphone} />
            <DeviceOption type="Laptop" icon={Laptop} />
            <DeviceOption type="Tablet" icon={Tablet} />
            <DeviceOption type="Other" icon={Watch} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
              <input
                type="text"
                required
                placeholder="e.g. Samsung"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
              <input
                type="text"
                placeholder="e.g. S21 Ultra"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Issue */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Diagnostic & Issue</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Issue Description</label>
            <div className="relative">
              <textarea
                required
                rows={4}
                placeholder="Describe the problem..."
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!brand || !issue || isAnalyzing}
                className="absolute right-3 bottom-3 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <Bot size={14} />
                {isAnalyzing ? "Analyzing..." : "Ask Gemini AI"}
              </button>
            </div>
            
            {aiPreview && (
              <div className="mt-3 p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800 flex gap-3">
                <Bot size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-1">AI Preliminary Diagnosis:</strong>
                  {aiPreview}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Service Type */}
        <div className="space-y-4">
           <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Service Preference</h3>
           <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="serviceType" 
                  checked={serviceType === ServiceType.HOME_SERVICE}
                  onChange={() => setServiceType(ServiceType.HOME_SERVICE)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-slate-700">Home Service</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="serviceType" 
                  checked={serviceType === ServiceType.SHOP_REPAIR}
                  onChange={() => setServiceType(ServiceType.SHOP_REPAIR)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-slate-700">Shop Repair</span>
              </label>
           </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Create Ticket & Notify Technicians
          </button>
        </div>
      </form>
    </div>
  );
};
