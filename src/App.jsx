import React, { useState } from 'react';
import Display from './components/Display';
import ButtonsContainer from './components/ButtonsContainer';
import VoiceCalculator from './components/VoiceCalculator';
import './App.css';

function App() {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const [isInverse, setIsInverse] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        let expression = display;
        
        // Convert display symbols to JavaScript operators
        expression = expression.replace(/×/g, '*');
        expression = expression.replace(/÷/g, '/');
        
        // Handle scientific operations
        if (isScientific) {
          expression = expression.replace(/sin/g, 'Math.sin');
          expression = expression.replace(/cos/g, 'Math.cos');
          expression = expression.replace(/tan/g, 'Math.tan');
          expression = expression.replace(/log/g, 'Math.log10');
          expression = expression.replace(/ln/g, 'Math.log');
          expression = expression.replace(/sqrt/g, 'Math.sqrt');
          expression = expression.replace(/pi/g, 'Math.PI');
          expression = expression.replace(/e/g, 'Math.E');
          
          if (isInverse) {
            expression = expression.replace(/arcsin/g, 'Math.asin');
            expression = expression.replace(/arccos/g, 'Math.acos');
            expression = expression.replace(/arctan/g, 'Math.atan');
          }
        }

        const calculatedResult = eval(expression);
        setResult(calculatedResult);
        setDisplay(calculatedResult.toString());
        
        // Add to history
        setHistory(prev => [...prev, { expression: display, result: calculatedResult }]);
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'CLR') {
      setDisplay('');
      setResult('');
    } else if (value === 'DEL') {
      setDisplay(display.slice(0, -1));
    } else if (value === 'HIST') {
      setShowHistory(!showHistory);
    } else if (value === 'INV') {
      setIsInverse(!isInverse);
    } else if (value === 'BACK') {
      setIsScientific(false);
    } else {
      // Convert operators back to display symbols for the display
      const displayValue = value === '*' ? '×' : value === '/' ? '÷' : value;
      setDisplay(display + displayValue);
    }
  };

  const handleHistoryClick = (item) => {
    setDisplay(item.expression);
    setResult(item.result);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="calculator">
      <Display display={display} result={result} />
      <ButtonsContainer 
        onButtonClick={handleButtonClick}
        isScientific={isScientific}
        setIsScientific={setIsScientific}
        history={history}
        onHistoryClick={handleHistoryClick}
        onClearHistory={handleClearHistory}
        isInverse={isInverse}
        showHistory={showHistory}
      />
      <VoiceCalculator onInputChange={handleButtonClick} />
    </div>
  );
}

export default App;