import React, { useState } from 'react';
import { Music, Terminal, Settings, Calculator, Store, Activity, FileText } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { SystemInfo } from './components/SystemInfo';
import { AudioPlayer } from './components/AudioPlayer';
import { Window } from './components/Window';
import { SettingsApp } from './components/SettingsApp';
import { CalculatorApp } from './components/CalculatorApp';
import { AppStore } from './components/AppStore';
import { SystemMonitor } from './components/SystemMonitor';
import { TextEditor } from './components/TextEditor';

export type WindowType = 'terminal' | 'audio' | 'settings' | 'calculator' | 'appstore' | 'monitor' | 'editor' | null;

function App() {
  const [activeWindows, setActiveWindows] = useState<WindowType[]>([]);
  const [windowOrder, setWindowOrder] = useState<WindowType[]>([]);

  const openWindow = (type: WindowType) => {
    if (type && !activeWindows.includes(type)) {
      setActiveWindows([...activeWindows, type]);
      setWindowOrder([...windowOrder, type]);
    }
  };

  const closeWindow = (type: WindowType) => {
    setActiveWindows(activeWindows.filter(w => w !== type));
    setWindowOrder(windowOrder.filter(w => w !== type));
  };

  const bringToFront = (type: WindowType) => {
    if (type && windowOrder[windowOrder.length - 1] !== type) {
      setWindowOrder([...windowOrder.filter(w => w !== type), type]);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986')] bg-cover bg-center">
      <div className="min-h-screen bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-sm">
        <TopBar onOpenWindow={openWindow} />
        
        <div className="container mx-auto p-4 pt-16 relative">
          {activeWindows.includes('terminal') && (
            <Window
              type="terminal"
              title="Terminal"
              onClose={() => closeWindow('terminal')}
              onFocus={() => bringToFront('terminal')}
              zIndex={windowOrder.indexOf('terminal')}
              icon={<Terminal size={16} />}
            >
              <SystemInfo />
            </Window>
          )}

          {activeWindows.includes('audio') && (
            <Window
              type="audio"
              title="Music Player"
              onClose={() => closeWindow('audio')}
              onFocus={() => bringToFront('audio')}
              zIndex={windowOrder.indexOf('audio')}
              icon={<Music size={16} />}
            >
              <AudioPlayer />
            </Window>
          )}

          {activeWindows.includes('settings') && (
            <Window
              type="settings"
              title="Settings"
              onClose={() => closeWindow('settings')}
              onFocus={() => bringToFront('settings')}
              zIndex={windowOrder.indexOf('settings')}
              icon={<Settings size={16} />}
            >
              <SettingsApp />
            </Window>
          )}

          {activeWindows.includes('calculator') && (
            <Window
              type="calculator"
              title="Calculator"
              onClose={() => closeWindow('calculator')}
              onFocus={() => bringToFront('calculator')}
              zIndex={windowOrder.indexOf('calculator')}
              icon={<Calculator size={16} />}
            >
              <CalculatorApp />
            </Window>
          )}

          {activeWindows.includes('appstore') && (
            <Window
              type="appstore"
              title="App Store"
              onClose={() => closeWindow('appstore')}
              onFocus={() => bringToFront('appstore')}
              zIndex={windowOrder.indexOf('appstore')}
              icon={<Store size={16} />}
            >
              <AppStore />
            </Window>
          )}

          {activeWindows.includes('monitor') && (
            <Window
              type="monitor"
              title="System Monitor"
              onClose={() => closeWindow('monitor')}
              onFocus={() => bringToFront('monitor')}
              zIndex={windowOrder.indexOf('monitor')}
              icon={<Activity size={16} />}
            >
              <SystemMonitor />
            </Window>
          )}

          {activeWindows.includes('editor') && (
            <Window
              type="editor"
              title="Text Editor"
              onClose={() => closeWindow('editor')}
              onFocus={() => bringToFront('editor')}
              zIndex={windowOrder.indexOf('editor')}
              icon={<FileText size={16} />}
            >
              <TextEditor />
            </Window>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
