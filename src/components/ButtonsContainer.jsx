import React from 'react';
import styles from "./ButtonsContainer.module.css";

const ButtonsContainer = ({ onButtonClick, isScientific, setIsScientific, history, onHistoryClick, onClearHistory, isInverse, showHistory }) => {
    const basicButtons = [
        '7', '8', '9', '÷',
        '4', '5', '6', '×',
        '1', '2', '3', '-',
        '0', '.', '=', '+',
        'DEL', 'CLR', 'HIST', 'SCI'
    ];

    const scientificButtons = [
        'INV', 'sin', 'cos', 'tan',
        'log', 'ln', 'sqrt', '^',
        '(', ')', 'pi', 'e',
        '7', '8', '9', '÷',
        '4', '5', '6', '×',
        '1', '2', '3', '-',
        '0', '.', '=', '+',
        'DEL', 'CLR', 'HIST', 'BACK'
    ];

    const handleClick = (value) => {
        if (value === 'SCI') {
            setIsScientific(true);
        } else {
            // Convert multiplication and division symbols to their operators
            const convertedValue = value === '×' ? '*' : value === '÷' ? '/' : value;
            onButtonClick(convertedValue);
        }
    };

    const getButtonLabel = (button) => {
        if (isInverse && ['sin', 'cos', 'tan'].includes(button)) {
            return `arc${button}`;
        }
        return button;
    };

    const getButtonClass = (button) => {
        const baseClass = styles.button;
        const specialClass = 
            button === 'SCI' || button === 'BACK' ? styles.scientificToggle :
            button === 'DEL' ? styles.removeButton :
            button === 'CLR' ? styles.clearButton :
            button === 'HIST' ? styles.historyButton :
            button === 'INV' ? `${styles.inverseButton} ${isInverse ? styles.active : ''}` : '';
        
        return `${baseClass} ${specialClass}`;
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.buttonsContainer} ${isScientific ? styles.scientificMode : ''}`}>
                {(isScientific ? scientificButtons : basicButtons).map((button) => (
                    <button
                        key={button}
                        onClick={() => handleClick(button)}
                        className={getButtonClass(button)}
                    >
                        {getButtonLabel(button)}
                    </button>
                ))}
            </div>
            {showHistory && (
                <div className={styles.historyPanel}>
                    <div className={styles.historyHeader}>
                        <h3>History</h3>
                        <button 
                            className={styles.clearHistoryButton}
                            onClick={onClearHistory}
                        >
                            Clear
                        </button>
                    </div>
                    <div className={styles.historyList}>
                        {history.length === 0 ? (
                            <div className={styles.noHistory}>No calculations yet</div>
                        ) : (
                            history.map((item, index) => (
                                <div
                                    key={index}
                                    className={styles.historyItem}
                                    onClick={() => onHistoryClick(item)}
                                >
                                    <div className={styles.historyExpression}>{item.expression}</div>
                                    <div className={styles.historyResult}>{item.result}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ButtonsContainer;