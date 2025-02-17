import React, { useState } from 'react';

export function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [lastResult, setLastResult] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(display === '0' ? num : display + num);
    setEquation(equation + num);
  };

  const handleOperator = (op: string) => {
    setDisplay('0');
    setEquation(equation + ' ' + op + ' ');
  };

  const handleEqual = () => {
    try {
      const result = eval(equation);
      setDisplay(result.toString());
      setLastResult(equation + ' = ' + result);
      setEquation(result.toString());
    } catch (e) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="w-[300px] bg-gray-900/50 rounded-lg p-4">
      <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
        <div className="text-gray-400 text-sm h-6">{equation || lastResult}</div>
        <div className="text-gray-200 text-2xl text-right">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button onClick={handleClear} className="col-span-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 p-3 rounded-lg">
          Clear
        </button>
        <button onClick={() => handleOperator('/')} className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-3 rounded-lg">
          ÷
        </button>
        <button onClick={() => handleOperator('*')} className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-3 rounded-lg">
          ×
        </button>

        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => handleNumber(num.toString())}
            className="bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 p-3 rounded-lg"
          >
            {num}
          </button>
        ))}

        <button onClick={() => handleOperator('-')} className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-3 rounded-lg">
          -
        </button>
        <button onClick={() => handleOperator('+')} className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-3 rounded-lg">
          +
        </button>

        <button
          onClick={() => handleNumber('0')}
          className="bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 p-3 rounded-lg"
        >
          0
        </button>
        <button
          onClick={() => handleNumber('.')}
          className="bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 p-3 rounded-lg"
        >
          .
        </button>
        <button
          onClick={handleEqual}
          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-3 rounded-lg col-span-2"
        >
          =
        </button>
      </div>
    </div>
  );
}