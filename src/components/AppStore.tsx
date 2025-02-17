import React from 'react';
import { Download } from 'lucide-react';

const FEATURED_APPS = [
  {
    name: 'Visual Studio Code',
    description: 'Code editing. Redefined.',
    icon: '🎨',
    category: 'Development'
  },
  {
    name: 'Spotify',
    description: 'Music for everyone.',
    icon: '🎵',
    category: 'Music'
  },
  {
    name: 'Discord',
    description: 'Talk, chat, hang out.',
    icon: '💬',
    category: 'Social'
  },
  {
    name: 'Firefox',
    description: 'Fast, private and secure browser.',
    icon: '🦊',
    category: 'Internet'
  }
];

export function AppStore() {
  return (
    <div className="w-[600px] text-gray-300">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Featured Apps</h2>
        <div className="grid grid-cols-2 gap-4">
          {FEATURED_APPS.map((app) => (
            <div key={app.name} className="bg-gray-800/50 rounded-lg p-4 flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center text-2xl">
                {app.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{app.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{app.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-700/50 px-2 py-1 rounded">
                    {app.category}
                  </span>
                  <button className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1">
                    <Download size={16} />
                    <span>Install</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-3 gap-4">
          {['Games', 'Productivity', 'Development', 'Graphics', 'Music', 'Video'].map((category) => (
            <button
              key={category}
              className="bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-4 text-left"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
