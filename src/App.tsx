import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import InvoiceView from './views/InvoiceView';
import CSManagementView from './views/CSManagementView';
import GuideView from './views/GuideView';
import OrdersView from './views/OrdersView';
import MappingView from './views/MappingView';
import SuppliersView from './views/SuppliersView';
import { Menu, Bell, Search } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'orders':
        return <OrdersView />;
      case 'mapping':
        return <MappingView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'invoice':
        return <InvoiceView />;
      case 'cs':
        return <CSManagementView />;
      case 'guide':
        return <GuideView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            <p className="text-xl font-bold mb-2">준비 중인 화면입니다.</p>
            <p className="text-sm uppercase tracking-widest font-black italic">{activeTab}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F0F10] font-sans text-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-[#0F0F10]/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-gray-400"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="h-6 w-[1px] bg-gray-800 mx-2 hidden md:block" />
            <div className="relative hidden md:block group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" />
              <input 
                type="text" 
                placeholder="주문번호, 고객명, 상품명 검색..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-gray-800 rounded-xl text-sm w-80 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 placeholder:text-gray-500 transition-all font-medium text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-gray-800 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                마켓 연동 정상
              </button>
            </div>
            <button className="relative p-2 hover:bg-white/5 rounded-lg text-gray-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-[#0F0F10]" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

