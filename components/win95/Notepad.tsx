"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { MessageBox } from "./MessageBox";
import { SaveDialog } from "./SaveDialog";
import { useOS } from "./OSContext";
import { FloppyIcon } from "../Icons";

export function Notepad() {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [showSavePrompt, setShowSavePrompt] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [resolveClose, setResolveClose] = useState<((val: boolean) => void) | null>(null);
    const { registerCloseInterceptor, unregisterCloseInterceptor, registerSaveHandler, unregisterSaveHandler } = useOS();

    // Formatting state - tracked purely locally, not synced with selection
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    // Close interception logic
    const handleCloseRequest = useCallback(() => {
        if (!isDirty) return Promise.resolve(true);

        setShowSavePrompt(true);
        return new Promise<boolean>((resolve) => {
            setResolveClose(() => resolve);
        });
    }, [isDirty]);

    const triggerSaveDialog = useCallback(() => {
        setShowSaveDialog(true);
    }, []);

    useEffect(() => {
        registerCloseInterceptor("notepad", handleCloseRequest);
        registerSaveHandler("notepad", triggerSaveDialog);
        return () => {
            unregisterCloseInterceptor("notepad");
            unregisterSaveHandler("notepad");
        };
    }, [registerCloseInterceptor, unregisterCloseInterceptor, registerSaveHandler, unregisterSaveHandler, handleCloseRequest, triggerSaveDialog]);

    const handleInput = () => {
        if (!isDirty) setIsDirty(true);
    };

    const convertToRTF = (html: string) => {
        let rtf = "{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Times New Roman;}}\\f0\\fs24 ";

        // Basic conversion
        let content = html;
        content = content.replace(/<br\s*\/?>/gi, "\\line ");
        content = content.replace(/<div>/gi, "\\line ");
        content = content.replace(/<\/div>/gi, "");
        content = content.replace(/<b>|<strong>/gi, "{\\b ");
        content = content.replace(/<\/b>|<\/strong>/gi, "}");
        content = content.replace(/<i>|<em>/gi, "{\\i ");
        content = content.replace(/<\/i>|<\/em>/gi, "}");
        content = content.replace(/<u>/gi, "{\\ul ");
        content = content.replace(/<\/u>/gi, "}");

        // Strip remaining tags
        content = content.replace(/<[^>]+>/g, "");

        rtf += content;
        rtf += "}";
        return rtf;
    };

    const handleDownload = (filename: string) => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            const rtfContent = convertToRTF(html);
            const blob = new Blob([rtfContent], { type: "application/rtf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${filename}.rtf`;
            a.click();
            URL.revokeObjectURL(url);
            setIsDirty(false);
            setShowSaveDialog(false);
            if (resolveClose) resolveClose(true);
        }
    };

    const promptConfirm = () => {
        setShowSavePrompt(false);
        setShowSaveDialog(true);
    };

    const promptDecline = () => {
        setIsDirty(false);
        setShowSavePrompt(false);
        if (resolveClose) resolveClose(true);
    };

    const promptCancel = () => {
        setShowSavePrompt(false);
        if (resolveClose) resolveClose(false);
    };

    const execCommand = (command: "bold" | "italic" | "underline", e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Ensure editor has focus before executing command
        if (editorRef.current) {
            editorRef.current.focus();
        }

        document.execCommand(command, false);
        setIsDirty(true);

        // Toggle local state directly - don't query browser state
        // This ensures button state only changes on click, not on text selection
        setActiveFormats(prev => ({
            ...prev,
            [command]: !prev[command],
        }));
    };

    return (
        <div className="flex flex-col flex-1 h-full w-full min-h-[150px] font-win95 bg-win95-gray">
            {/* Notepad Toolbar */}
            <div className="flex items-center gap-1 p-1 border-b border-white shadow-[inset_-1px_-1px_0_0_#808080]">
                <button
                    onMouseDown={(e) => execCommand("bold", e)}
                    className={`${activeFormats.bold ? "win95-beveled-inset bg-gray-200" : "win95-button"} w-8 h-8 font-bold text-[14px] flex items-center justify-center`}
                    title="Bold"
                    data-testid="notepad-bold"
                >
                    B
                </button>
                <button
                    onMouseDown={(e) => execCommand("italic", e)}
                    className={`${activeFormats.italic ? "win95-beveled-inset bg-gray-200" : "win95-button"} w-8 h-8 italic text-[14px] font-win95 flex items-center justify-center`}
                    title="Italic"
                    data-testid="notepad-italic"
                >
                    I
                </button>
                <button
                    onMouseDown={(e) => execCommand("underline", e)}
                    className={`${activeFormats.underline ? "win95-beveled-inset bg-gray-200" : "win95-button"} w-8 h-8 underline text-[14px] flex items-center justify-center`}
                    title="Underline"
                    data-testid="notepad-underline"
                >
                    U
                </button>
                <div className="w-[2px] h-6 bg-gray-400 mx-1 border-r border-white" />
                <button
                    onClick={triggerSaveDialog}
                    className="win95-button w-8 h-8 flex items-center justify-center"
                    title="Save"
                    data-testid="notepad-save"
                >
                    <FloppyIcon size={20} />
                </button>
                <div className="w-[2px] h-6 bg-gray-400 mx-1 border-r border-white" />
                <span className="text-[11px] px-2 text-gray-700 font-win95" data-testid="notepad-status-label">Rich Text Mode</span>
            </div>

            {/* Editing Area */}
            <div className="flex-1 flex flex-col p-[2px] overflow-hidden min-h-0">
                <div className="flex-1 bg-white p-2 border-2 border-win95-gray-shadow shadow-[inset_2px_2px_0_0_#000000] overflow-auto min-h-0">
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        className="h-full outline-none text-[14px] leading-tight font-serif whitespace-pre-wrap"
                        data-testid="notepad-editor"
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-win95-gray border-t border-white h-6 flex items-center px-2 text-[10px] text-gray-700 shadow-[inset_-1px_-1px_0_0_#808080]">
                <span>Status: {isDirty ? "Modified" : "Ready"}</span>
            </div>

            {showSavePrompt && (
                <MessageBox
                    title="Notepad"
                    message={`The text in the document has changed.

Do you want to save the changes?`}
                    buttons="yesnocancel"
                    onConfirm={promptConfirm}
                    onCancel={promptDecline}
                    onClose={promptCancel}
                />
            )}

            {showSaveDialog && (
                <SaveDialog
                    onSave={handleDownload}
                    onCancel={() => {
                        setShowSaveDialog(false);
                        if (resolveClose) resolveClose(false);
                    }}
                />
            )}
        </div>
    );
}
