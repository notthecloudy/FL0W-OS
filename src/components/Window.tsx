import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import type { WindowType } from '../App';

interface WindowProps {
  children: React.ReactNode;
  title: string;
  type: WindowType;
  icon?: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  zIndex: number;
}

export function Window({ children, title, icon, onClose, onFocus, zIndex }: WindowProps) {
  const [position, setPosition] = useState({ x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      onFocus();
    }
  };

  return (
    <div
      ref={windowRef}
      className="absolute bg-gray-900/80 backdrop-blur-md rounded-lg overflow-hidden border border-gray-700/50 shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        zIndex: zIndex + 10,
        minWidth: '400px'
      }}
      onClick={onFocus}
    >
      <div
        className="p-2 bg-gray-800/50 border-b border-gray-700/50 flex items-center justify-between cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2 text-gray-300 text-sm">
          {icon}
          <span>{title}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}