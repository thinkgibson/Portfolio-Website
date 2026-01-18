"use client";

import React, { useState } from "react";

export function Calculator() {
    const [display, setDisplay] = useState("0");
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);

    const handleNumberClick = (num: string) => {
        if (waitingForNewValue) {
            setDisplay(num);
            setWaitingForNewValue(false);
        } else {
            setDisplay(display === "0" ? num : display + num);
        }
    };

    const handleOperatorClick = (op: string) => {
        const currentValue = parseFloat(display);

        if (prevValue === null) {
            setPrevValue(currentValue);
        } else if (operator) {
            const result = calculate(prevValue, currentValue, operator);
            setPrevValue(result);
            setDisplay(String(result));
        }

        setOperator(op);
        setWaitingForNewValue(true);
    };

    const calculate = (a: number, b: number, op: string) => {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return b !== 0 ? a / b : 0; // Handle division by zero
            default: return b;
        }
    };

    const handleEqualClick = () => {
        if (prevValue !== null && operator) {
            const currentValue = parseFloat(display);
            const result = calculate(prevValue, currentValue, operator);
            setDisplay(String(result));
            setPrevValue(null);
            setOperator(null);
            setWaitingForNewValue(true);
        }
    };

    const handleClearClick = () => {
        setDisplay("0");
        setPrevValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
    };

    return (
        <div className="flex flex-col h-full w-full bg-win95-gray p-1 font-win95">
            {/* Display Screen */}
            <div className="bg-white border-2 border-win95-gray-shadow p-2 mb-2 text-right font-mono text-xl h-10 flex items-center justify-end overflow-hidden">
                {display}
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-4 gap-1 p-1 flex-1">
                {/* Row 1 */}
                <button className="win95-button font-bold text-red-800 col-span-1" onClick={handleClearClick}>C</button>
                <button className="win95-button font-bold" onClick={() => handleOperatorClick("/")}>/</button>
                <button className="win95-button font-bold" onClick={() => handleOperatorClick("*")}>*</button>
                <button className="win95-button font-bold" onClick={() => handleOperatorClick("-")}>-</button>

                {/* Row 2 */}
                <button className="win95-button font-bold" onClick={() => handleNumberClick("7")}>7</button>
                <button className="win95-button font-bold" onClick={() => handleNumberClick("8")}>8</button>
                <button className="win95-button font-bold" onClick={() => handleNumberClick("9")}>9</button>
                <button className="win95-button font-bold row-span-2" onClick={() => handleOperatorClick("+")}>+</button>

                {/* Row 3 */}
                <button className="win95-button font-bold" onClick={() => handleNumberClick("4")}>4</button>
                <button className="win95-button font-bold" onClick={() => handleNumberClick("5")}>5</button>
                <button className="win95-button font-bold" onClick={() => handleNumberClick("6")}>6</button>

                {/* Row 4 */}
                <button className="win95-button font-bold" onClick={() => handleNumberClick("1")}>1</button>
                <button className="win95-button font-bold" onClick={() => handleNumberClick("2")}>2</button>
                <button className="win95-button font-bold" onClick={() => handleNumberClick("3")}>3</button>
                <button className="win95-button font-bold row-span-2" onClick={handleEqualClick}>=</button>

                {/* Row 5 */}
                <button className="win95-button font-bold col-span-2" onClick={() => handleNumberClick("0")}>0</button>
                <button className="win95-button font-bold" onClick={() => handleNumberClick(".")}>.</button>
            </div>
        </div>
    );
}
