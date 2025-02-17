import React, { useState } from 'react';
import { Save, FileText } from 'lucide-react';

export function TextEditor() {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('untitled.txt');

  const handleSave = () => {
    // In a real app, this would save the file
    console.log('Saving:', fileName, content);
  };

  return (
    <div className="w-[600px] h-[400px] flex flex-col">
      <div className="flex items-center justify-between p-2 bg-gray-800/50 border-b border-gray-700/50">
        <div className="flex items-center space-x-2">
          <FileText size={16} className="text-gray-400" />
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="bg-transparent border-none outline-none text-gray-300 text-sm selectable"
          />
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm px-2 py-1 rounded"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 bg-transparent text-gray-300 p-4 outline-none resize-none font-mono text-sm selectable"
        placeholder="Start typing..."
      />
    </div>
  );
}