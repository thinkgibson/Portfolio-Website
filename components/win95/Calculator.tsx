"use client";

import React, { useState } from "react";

export function Calculator() {
    const [display, setDisplay] = useState("0");
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [expression, setExpression] = useState("");
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);
    const [resetExpression, setResetExpression] = useState(false);

    const handleNumberClick = (num: string) => {
        if (resetExpression) {
            setDisplay(num);
            setExpression(num);
            setResetExpression(false);
            setWaitingForNewValue(false);
            return;
        }

        if (waitingForNewValue) {
            setDisplay(num);
            setExpression(prev => prev + num);
            setWaitingForNewValue(false);
        } else {
            const newDisplay = display === "0" ? num : display + num;
            setDisplay(newDisplay);
            setExpression(prev => (prev === "" || prev === "0") && num !== "." ? num : prev + num);
        }
    };

    const handleOperatorClick = (op: string) => {
        const currentValue = parseFloat(display);
        setResetExpression(false);

        if (prevValue === null) {
            setPrevValue(currentValue);
        } else if (operator) {
            const result = calculate(prevValue, currentValue, operator);
            setPrevValue(result);
        }

        setExpression(prev => {
            // If already has an operator at the end, replace it
            if (prev.match(/[+\-*/]$/)) {
                return prev.slice(0, -1) + op;
            }
            return prev + op;
        });
        setOperator(op);
        setWaitingForNewValue(true);
    };

    const calculate = (a: number, b: number, op: string) => {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return b !== 0 ? a / b : 0;
            default: return b;
        }
    };

    const handleEqualClick = () => {
        if (prevValue !== null && operator) {
            const currentValue = parseFloat(display);
            const result = calculate(prevValue, currentValue, operator);
            const resultStr = String(result);
            setDisplay(resultStr);
            setExpression(resultStr);
            setPrevValue(null);
            setOperator(null);
            setWaitingForNewValue(false);
            setResetExpression(true);
        }
    };

    const handleClearClick = () => {
        setDisplay("0");
        setExpression("0");
        setPrevValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
        setResetExpression(false);
    };

    return (
        <div className="h-full w-full bg-win95-gray p-1 font-win95">
            <div className="m-[1px] p-2 win95-beveled-inset bg-white flex flex-col h-[calc(100%-2px)] [container-type:size]">
                {/* Display Screen */}
                <div className="bg-white border-2 border-win95-gray-shadow p-1 mb-2 text-right font-mono flex-shrink-0 h-[18%] flex items-center justify-end overflow-hidden [font-size:24cqmin] min-h-[3rem]" title={expression}>
                    {expression || display}
                </div>
                <div className="grid grid-cols-4 gap-2 flex-grow">
                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={handleClearClick}>C</button>
                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleOperatorClick("/")}>/</button>
                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleOperatorClick("*")}>*</button>
                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleOperatorClick("-")}>-</button>

                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleNumberClick("7")}>7</button>
                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleNumberClick("8")}>8</button>
                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleNumberClick("9")}>9</button>
                    <button className="win95-button font-bold row-span-2 flex items-center justify-center [font-size:20cqmin]" onClick={() => handleOperatorClick("+")}>+</button>

                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleNumberClick("4")}>4</button>
                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleNumberClick("5")}>5</button>
                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleNumberClick("6")}>6</button>

                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleNumberClick("1")}>1</button>
                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleNumberClick("2")}>2</button>
                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleNumberClick("3")}>3</button>
                    <button className="win95-button font-bold row-span-2 flex items-center justify-center [font-size:20cqmin]" onClick={handleEqualClick}>=</button>

                    <button className="win95-button font-bold col-span-2 flex items-center justify-center [font-size:20cqmin]" onClick={() => handleNumberClick("0")}>0</button>
                    <button className="win95-button font-bold flex items-center justify-center [font-size:20cqmin]" onClick={() => handleNumberClick(".")}>.</button>
                </div>
            </div>
        </div>
    );
}
