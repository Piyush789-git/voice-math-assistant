import React, { useState } from 'react';
import styles from './VoiceCalculator.module.css';

const VoiceCalculator = ({ onInputChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const convertToExpression = (speech) => {
    try {
      let cleanedSpeech = speech.toLowerCase().trim();
      console.log('Cleaned speech:', cleanedSpeech);

      // Convert words to numbers and operators
      let expression = cleanedSpeech
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/(multiply|multiplied by|times|into)/g, '*')
        .replace(/(divide|divided by)/g, '/')
        .replace(/by/g, '/') // risky: only use this when preceded by "divided"
        .replace(/equals|equal to|is/g, '=')
        .replace(/point/g, '.')
        .replace(/[^0-9+\-*/().=]/g, ''); // allow only math characters

      console.log('After conversion:', expression);

      // Remove trailing '=' if any
      if (expression.endsWith('=')) {
        expression = expression.slice(0, -1);
      }

      if (!/[+\-*/]/.test(expression)) {
        throw new Error('No valid operator found in input');
      }

      return expression;
    } catch (error) {
      console.error('Error converting speech to expression:', error);
      throw error;
    }
  };

  const addToHistory = (expression, result) => {
    const historyItem = {
      expression,
      result,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prevHistory => [historyItem, ...prevHistory].slice(0, 5));
  };

  const calculateResult = (expression) => {
    try {
      // Clean the input before evaluation
      let cleanInput = expression.trim();
      
      // Remove any remaining spaces
      cleanInput = cleanInput.replace(/\s+/g, '');
      
      console.log('Calculating:', cleanInput);
      
      const result = eval(cleanInput);
      
      // Check if result is valid
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation');
      }
      
      // Format the result to handle decimal places
      const formattedResult = Number(result.toFixed(8)).toString();
      
      // Add to history
      addToHistory(cleanInput, formattedResult);
      
      return formattedResult;
    } catch (error) {
      console.error('Calculation error:', error);
      throw error;
    }
  };

  const handleSpeak = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setInput('');
    };

    recognition.onresult = (event) => {
      try {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        
        // Convert spoken words to mathematical expression
        const expression = convertToExpression(transcript);
        console.log('Converted expression:', expression);
        
        // Calculate the result
        const result = calculateResult(expression);
        console.log('Calculation result:', result);
        
        // Update the display
        setInput(result);
        onInputChange(result);
      } catch (error) {
        console.error('Error processing speech:', error);
        setError('Could not understand the calculation. Please try again.');
        setInput('');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError('Error recognizing speech. Please try again.');
      setIsListening(false);
      setInput('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setError('Error starting speech recognition. Please try again.');
      setIsListening(false);
      setInput('');
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      try {
        const result = calculateResult(input);
        setInput(result);
        onInputChange(result);
      } catch (error) {
        setError('Invalid calculation. Please try again.');
      }
    }
  };

  return (
    <div className={styles.voiceCalculator}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter your calculation"
          className={styles.input}
          disabled={isListening}
        />
        <button
          onClick={handleSpeak}
          className={`${styles.speakButton} ${isListening ? styles.listening : ''}`}
          disabled={isListening}
        >
          {isListening ? 'Listening...' : 'Speak'}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default VoiceCalculator; 