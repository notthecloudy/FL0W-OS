import React, { useState } from 'react';

export function SystemInfo() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim().toLowerCase();
      setOutput([...output, `> ${input}`]);
      
      if (command === 'neofetch') {
        setOutput([...output, `> ${input}`, `
yuki@archlinux
--------------
OS: Arch Linux x86_64
Host: MS-7788 3.0
Kernel: 6.13.2-arch1-1
Uptime: 1 day, 18 hours, 4 mins
Packages: 1024 (pacman)
Shell: fish 3.7.1
Resolution: 1440x900
WM: dwm
Theme: Catppuccin-Mocha-Standard
Icons: Breeze-Round-Chameleon Dark
Terminal: st
CPU: Intel i7-4770K (8) @ 4.000GHz
Memory: 1.56GiB / 7.65GiB (20%)
`]);
      } else if (command === 'clear') {
        setOutput([]);
      } else if (command) {
        setOutput([...output, `> ${input}`, `Command not found: ${command}`]);
      }
      
      setInput('');
    }
  };

  return (
    <div className="font-mono text-sm">
      <div className="text-cyan-400 whitespace-pre-wrap">
        {output.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="flex items-center text-cyan-400 mt-2">
        <span className="mr-2">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="bg-transparent border-none outline-none text-cyan-400 w-full"
          autoFocus
        />
      </div>
    </div>
  );
}