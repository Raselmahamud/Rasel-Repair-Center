import React, { useState } from 'react';
import { Customer } from '../types';
import { Plus, Search, Phone, Mail, MapPin, X, User, UserPlus, Check } from 'lucide-react';

interface CustomerListViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
}

export const CustomerListView: React.FC<CustomerListViewProps> = ({ customers, onAddCustomer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCustomer({
      id: Date.now().toString(),
      name,
      phone,
      email: email || '-',
      address,
      totalRepairs: 0,
      joinedAt: Date.now()
    });
    setIsModalOpen(false);
    // Reset form
    setName(''); 
    setPhone(''); 
    setEmail(''); 
    setAddress('');
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col">
       {/* Header & Toolbar */}
       <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
            <p className="text-slate-500">Manage customer database and details.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Add Customer
          </button>
       </div>

       {/* Search */}
       <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers by name or phone..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
         </div>
       </div>

       {/* Table */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Repairs</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <User size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{customer.name}</div>
                            <div className="text-xs text-slate-400">ID: {customer.id.slice(-4)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                           <Phone size={14} className="text-slate-400"/> {customer.phone}
                         </div>
                         {customer.email && customer.email !== '-' && (
                           <div className="flex items-center gap-2 text-sm text-slate-600">
                             <Mail size={14} className="text-slate-400"/> {customer.email}
                           </div>
                         )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-slate-400" /> {customer.address}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                           {customer.totalRepairs} Repairs
                         </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                         {new Date(customer.joinedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No customers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
       </div>

       {/* Add Customer Modal */}
       {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-fade-in-up">
             
             {/* Header */}
             <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
               <div className="flex gap-4">
                 <div className="p-3 bg-blue-100 text-blue-600 rounded-xl flex-shrink-0">
                   <UserPlus size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800">Add New Customer</h3>
                   <p className="text-sm text-slate-500 mt-1">Enter customer details to create a profile.</p>
                 </div>
               </div>
               <button 
                 onClick={() => setIsModalOpen(false)} 
                 className="text-slate-400 hover:text-slate-600 rounded-lg p-2 hover:bg-slate-100 transition-colors"
               >
                 <X size={20} />
               </button>
             </div>

             {/* Body */}
             <form onSubmit={handleSubmit} className="p-6 space-y-5">
               
               {/* Name Field */}
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                 <div className="relative group">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                   <input 
                     required 
                     type="text" 
                     value={name} 
                     onChange={e => setName(e.target.value)} 
                     className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                     placeholder="e.g. Rasel Ahmed" 
                   />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-5">
                 {/* Phone Field */}
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                   <div className="relative group">
                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                     <input 
                       required 
                       type="tel" 
                       value={phone} 
                       onChange={e => setPhone(e.target.value)} 
                       className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                       placeholder="+880..." 
                     />
                   </div>
                 </div>
                 
                 {/* Email Field */}
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email <span className="text-slate-400 font-normal">(Optional)</span></label>
                   <div className="relative group">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                     <input 
                       type="email" 
                       value={email} 
                       onChange={e => setEmail(e.target.value)} 
                       className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                       placeholder="user@example.com" 
                     />
                   </div>
                 </div>
               </div>

               {/* Address Field */}
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
                 <div className="relative group">
                   <MapPin className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                   <textarea 
                     required 
                     value={address} 
                     onChange={e => setAddress(e.target.value)} 
                     rows={3} 
                     className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none" 
                     placeholder="Enter full address details..." 
                   />
                 </div>
               </div>

               {/* Footer */}
               <div className="pt-2 flex gap-3">
                 <button 
                   type="button" 
                   onClick={() => setIsModalOpen(false)} 
                   className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="flex-[2] py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                 >
                   <Check size={20} />
                   Create Profile
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}
    </div>
  );
};
