import React, { useState, useEffect } from 'react';
import { CpuIcon, HardDrive, MemoryStick as Memory } from 'lucide-react';

export function SystemMonitor() {
  const [cpuUsage, setCpuUsage] = useState(Math.random() * 100);
  const [memoryUsage, setMemoryUsage] = useState(Math.random() * 100);
  const [diskUsage, setDiskUsage] = useState(75);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.random() * 100);
      setMemoryUsage(Math.random() * 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatUsage = (value: number) => `${Math.round(value)}%`;

  return (
    <div className="w-[500px] text-gray-300">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CpuIcon size={16} className="text-cyan-400" />
              <span>CPU Usage</span>
            </div>
            <span>{formatUsage(cpuUsage)}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${cpuUsage}%` }}
            />
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 p-2 rounded-lg">
                <div className="text-xs text-gray-400">Core {i + 1}</div>
                <div className="text-sm">{formatUsage(Math.random() * 100)}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Memory size={16} className="text-green-400" />
              <span>Memory Usage</span>
            </div>
            <span>{formatUsage(memoryUsage)}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 transition-all duration-500"
              style={{ width: `${memoryUsage}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-400">
            {Math.round(memoryUsage * 0.16)} GB / 16 GB
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <HardDrive size={16} className="text-purple-400" />
              <span>Disk Usage</span>
            </div>
            <span>{formatUsage(diskUsage)}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400"
              style={{ width: `${diskUsage}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-400">
            750 GB / 1 TB
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Running Processes</h3>
          <div className="space-y-2">
            {[
              { name: 'System', cpu: 2.5, memory: 156 },
              { name: 'Browser', cpu: 15.2, memory: 1240 },
              { name: 'Terminal', cpu: 0.5, memory: 45 },
              { name: 'Music Player', cpu: 1.2, memory: 85 }
            ].map((process) => (
              <div key={process.name} className="flex items-center justify-between text-sm">
                <span>{process.name}</span>
                <div className="flex space-x-4 text-gray-400">
                  <span>{process.cpu}%</span>
                  <span>{process.memory} MB</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}