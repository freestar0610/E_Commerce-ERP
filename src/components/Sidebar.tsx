import React from 'react';
import { motion } from 'motion/react';
import { SIDEBAR_ITEMS, ADMIN_ITEMS } from '../constants';
import { LayoutGrid } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isOpen: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen }: SidebarProps) {
  return (
    <motion.aside
      initial={{ width: isOpen ? 240 : 80 }}
      animate={{ width: isOpen ? 240 : 80 }}
      className="h-screen bg-[#0F0F10] text-gray-400 flex flex-col border-r border-gray-800/50 z-20"
    >
      <div className="p-6 mb-8 flex items-center gap-3 overflow-hidden">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30">
          <LayoutGrid className="w-4 h-4" />
        </div>
        {isOpen && (
          <span className="text-white font-black text-lg tracking-tight whitespace-nowrap">NexCommerce</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <nav className="space-y-1 mb-8">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-white/10 text-white font-bold' 
                  : 'hover:bg-white/5 hover:text-gray-200'}
              `}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-blue-500' : 'text-gray-500'}`} />
              {isOpen && <span className="text-[13px] whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="h-[1px] bg-gray-800/50 mb-6 mx-2" />

        <nav className="space-y-1">
          {ADMIN_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-white/10 text-white font-bold' 
                  : 'hover:bg-white/5 hover:text-gray-200'}
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 text-gray-500" />
              {isOpen && <span className="text-[13px] whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 overflow-hidden border border-gray-800/50 group cursor-pointer hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex-shrink-0 shadow-lg shadow-blue-600/20" />
          {isOpen && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate text-left">freestar0610@gmail.com</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-left">v1.2.0 PRO</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
