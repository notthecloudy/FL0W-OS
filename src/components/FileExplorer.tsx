import React from 'react';
import { X, Search, FolderOpen } from 'lucide-react';

interface Folder {
  icon: React.ReactNode;
  name: string;
}

interface FileExplorerProps {
  folders: Folder[];
  onClose: () => void;
}

export function FileExplorer({ folders, onClose }: FileExplorerProps) {
  return (
    <div className="col-span-12 md:col-span-8 bg-gray-900/80 backdrop-blur-md rounded-lg overflow-hidden border border-gray-700/50">
      <div className="p-2 bg-gray-800/50 border-b border-gray-700/50 flex items-center justify-between">
        <span className="text-gray-300 text-sm">File Explorer</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
          <X size={18} />
        </button>
      </div>
      
      <div className="grid grid-cols-12 h-[600px]">
        {/* Sidebar */}
        <div className="col-span-3 bg-gray-900/50 border-r border-gray-700/50 p-2">
          <div className="space-y-2">
            {folders.map((folder) => (
              <div key={folder.name} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700/50 p-2 rounded cursor-pointer text-sm">
                {folder.icon}
                <span>{folder.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="col-span-9 p-4">
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-md p-2 mb-4">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              className="bg-transparent border-none outline-none text-gray-300 w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <FolderOpen size={24} className="text-gray-400" />
                </div>
                <span className="text-gray-300 text-sm">Folder {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}