"use client";

import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { useOS } from "./OSContext";
import { Download, X, Eraser, Pen, MousePointer, Stamp } from "lucide-react";

type ToolType = "pencil" | "brush" | "eraser" | "stamp";
type ColorType = string;

const COLORS: ColorType[] = [
    "#000000", "#787878", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080",
    "#808005", "#004040", "#0080FF", "#004080", "#4000FF", "#804000", "#FFFFFF", "#C0C0C0",
    "#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#FFFF80", "#00FF80",
    "#80FFFF", "#8080FF", "#FF8000", "#FF80FF"
];

export function Paint() {
    const { registerCloseInterceptor, registerSaveHandler, unregisterCloseInterceptor, unregisterSaveHandler } = useOS();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tool, setTool] = useState<ToolType>("pencil");
    const [color, setColor] = useState<ColorType>("#000000");
    const [lineWidth, setLineWidth] = useState(1);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

    // Handle initial sizing
    useEffect(() => {
        // Just initial setup if needed
    }, []);

    // Registration for close and save
    useEffect(() => {
        const handleSave = () => {
            if (canvasRef.current) {
                const link = document.createElement("a");
                link.download = "untitled.png";
                link.href = canvasRef.current.toDataURL();
                link.click();
                setIsModified(false);
            }
        };

        const handleClose = async () => {
            if (isModified) {
                return confirm("Save changes to untitled.png?");
            }
            return true;
        };

        registerSaveHandler("paint", handleSave);
        registerCloseInterceptor("paint", handleClose);

        return () => {
            unregisterSaveHandler("paint");
            unregisterCloseInterceptor("paint");
        };
    }, [isModified, registerCloseInterceptor, registerSaveHandler, unregisterCloseInterceptor, unregisterSaveHandler]);

    // Drawing Logic
    const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
        ctx.lineWidth = tool === 'brush' || tool === 'eraser' ? (lineWidth * 4) : lineWidth;
        ctx.lineCap = "round";
        setIsDrawing(true);
    };

    const draw = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        setIsModified(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    // Tool Button Helper
    const toolBtnClass = (t: ToolType) =>
        `w-12 h-12 flex items-center justify-center border-4 ${tool === t ? 'border-black bg-white border-inset' : 'border-win95-gray-light bg-win95-gray win95-beveled'}`;

    const renderToolButton = (t: ToolType, Icon: any, label: string) => (
        <button
            className={toolBtnClass(t)}
            onClick={() => setTool(t)}
            title={label}
        >
            <Icon size={24} />
        </button>
    );

    return (
        <div className="flex flex-col h-full w-full bg-win95-gray font-win95 select-none">
            {/* Toolbar Area */}
            <div className="flex flex-row p-1 gap-1 border-b border-win95-gray-shadow">
                {/* Tools */}
                <div className="flex flex-wrap gap-2 p-2 w-40 bg-win95-gray">
                    {renderToolButton("pencil", Pen, "Pencil")}
                    {renderToolButton("brush", MousePointer, "Brush")}
                    {renderToolButton("eraser", Eraser, "Eraser")}
                    {renderToolButton("stamp", Stamp, "Stamp")}
                </div>

                {/* Colors */}
                <div className="flex flex-wrap gap-1 w-64 p-2 border-4 border-win95-gray-shadow inset-shadow bg-white">
                    {COLORS.map((c) => (
                        <button
                            key={c}
                            style={{ backgroundColor: c }}
                            className={`w-6 h-6 border-2 ${color === c ? 'border-black border-dotted' : 'border-gray-400'}`}
                            onClick={() => setColor(c)}
                        />
                    ))}
                </div>

                {/* Status/Options */}
                <div className="flex-1 flex flex-col justify-center items-start px-4 text-[18px]">
                    <div>Tool: {tool}</div>
                    <div>Line: {lineWidth}px</div>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-auto bg-[#808080] p-1 relative scrollbar-win95" style={{ cursor: tool === 'pencil' || tool === 'brush' ? 'crosshair' : 'default' }}>
                <div className="bg-white shadow-[2px_2px_4px_rgba(0,0,0,0.5)] w-[600px] h-[400px]">
                    <canvas
                        ref={canvasRef}
                        data-testid="paint-canvas"
                        width={600}
                        height={400}
                        className="cursor-crosshair w-full h-full"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-win95-gray border-t border-win95-gray-shadow p-2 text-[18px]">
                For Help, click Help Topics on the Help Menu.
            </div>
        </div>
    );
}
