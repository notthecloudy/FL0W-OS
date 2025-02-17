import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Volume2, Terminal, Music, Settings, Calculator, Store, Activity, FileText } from 'lucide-react';
import type { WindowType } from '../App';

interface TopBarProps {
  onOpenWindow: (type: WindowType) => void;
}

export function TopBar({ onOpenWindow }: TopBarProps) {
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        setBatteryLevel(battery.level * 100);
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      }
    };
    updateBattery();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-md text-gray-300 px-4 flex items-center justify-between text-sm z-50">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => onOpenWindow('terminal')}
          className="hover:bg-white/10 p-1 rounded"
        >
          <Terminal size={16} />
        </button>
        <button 
          onClick={() => onOpenWindow('audio')}
          className="hover:bg-white/10 p-1 rounded"
        >
          <Music size={16} />
        </button>
        <button 
          onClick={() => onOpenWindow('settings')}
          className="hover:bg-white/10 p-1 rounded"
        >
          <Settings size={16} />
        </button>
        <button 
          onClick={() => onOpenWindow('calculator')}
          className="hover:bg-white/10 p-1 rounded"
        >
          <Calculator size={16} />
        </button>
        <button 
          onClick={() => onOpenWindow('appstore')}
          className="hover:bg-white/10 p-1 rounded"
        >
          <Store size={16} />
        </button>
        <button 
          onClick={() => onOpenWindow('monitor')}
          className="hover:bg-white/10 p-1 rounded"
        >
          <Activity size={16} />
        </button>
        <button 
          onClick={() => onOpenWindow('editor')}
          className="hover:bg-white/10 p-1 rounded"
        >
          <FileText size={16} />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        {batteryLevel !== null && (
          <div className="flex items-center">
            <span>{Math.round(batteryLevel)}%{isCharging ? ' ⚡' : ''}</span>
            <Battery size={16} className="ml-1" />
          </div>
        )}
        <Wifi size={16} />
        <Volume2 size={16} />
        <span>{time.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}