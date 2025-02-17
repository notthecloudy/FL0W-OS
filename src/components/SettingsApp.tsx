import React from 'react';

export function SettingsApp() {
  return (
    <div className="text-gray-300 w-[500px]">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 mb-4">
          <h2 className="text-xl font-semibold mb-2">System Settings</h2>
          <div className="h-px bg-gray-700 w-full"></div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Appearance</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span>Dark Mode</span>
                <input type="checkbox" checked className="form-checkbox" />
              </label>
              <label className="flex items-center justify-between">
                <span>Transparency</span>
                <input type="checkbox" checked className="form-checkbox" />
              </label>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Sound</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span>System Sounds</span>
                <input type="checkbox" checked className="form-checkbox" />
              </label>
              <div className="flex items-center justify-between">
                <span>Volume</span>
                <input type="range" min="0" max="100" defaultValue="50" className="w-32" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Display</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Brightness</span>
                <input type="range" min="0" max="100" defaultValue="80" className="w-32" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Power</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span>Auto Sleep</span>
                <select className="bg-gray-700 rounded px-2 py-1">
                  <option>Never</option>
                  <option>5 minutes</option>
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}