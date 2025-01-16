import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, LineChart, ChevronRight, Lock, ChevronDown } from 'lucide-react';

const MainLanding = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  const menuItems = [
    {
      icon: Users,
      label: 'People',
      description: 'Manage your relationships',
      color: 'text-blue-600',
      bgHover: 'hover:bg-blue-50',
      iconBg: 'bg-blue-50',
      path: '/people',
      available: true
    },
    {
      icon: Briefcase,
      label: 'Pipeline',
      description: 'Track your opportunities',
      color: 'text-gray-400',
      bgHover: '',
      iconBg: 'bg-gray-50',
      path: '/pipeline',
      available: false
    },
    {
      icon: LineChart,
      label: 'Deals',
      description: 'Monitor your transactions',
      color: 'text-gray-400',
      bgHover: '',
      iconBg: 'bg-gray-50',
      path: '/deals',
      available: false
    }
  ];

  const handleNavigation = (path, available) => {
    if (available) {
      navigate(path);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Welcome Header */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-2xl font-light text-gray-800">
          Welcome to<br />
          <span className="font-medium">Harbor CRM</span>
        </h1>
      </div>

      {/* Pull Down Indicator */}
      <div className="flex justify-center items-center mb-4">
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <ChevronDown className="w-4 h-4" />
          <span>Pull down for quick actions</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-6">
        <div className="max-w-lg mx-auto space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path, item.available)}
              disabled={!item.available}
              className={`w-full p-6 rounded-xl border border-gray-100 
                ${item.available 
                  ? `${item.bgHover} hover:border-gray-200 active:bg-gray-50` 
                  : 'opacity-50 cursor-not-allowed'
                } 
                transition-all duration-200 text-left relative group`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full ${item.iconBg} flex items-center justify-center`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{item.label}</h3>
                    {!item.available && (
                      <Lock className="w-4 h-4 text-gray-400 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                </div>

                {item.available && (
                  <ChevronRight className={`w-5 h-5 text-gray-400 
                    group-hover:text-gray-600 transition-colors`} 
                  />
                )}
              </div>
            </button>
          ))}

          {/* More Options Link */}
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-full py-4 text-center text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            Click here for more options
          </button>
        </div>
      </div>

      {/* Coming Soon Footer */}
      <div className="mt-auto border-t">
        <div className="px-6 py-4">
          <p className="text-sm text-center text-gray-500">
            More exciting features coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainLanding;