"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { MessageBox } from "./MessageBox";
import { SaveDialog } from "./SaveDialog";
import { useOS } from "./OSContext";
import { FloppyIcon } from "./icons";

export function Notepad() {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [showSavePrompt, setShowSavePrompt] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [resolveClose, setResolveClose] = useState<((val: boolean) => void) | null>(null);
    const { registerCloseInterceptor, unregisterCloseInterceptor, registerSaveHandler, unregisterSaveHandler } = useOS();

    // Formatting state for highlighting toolbar buttons
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    const updateActiveFormats = useCallback(() => {
        if (typeof document !== 'undefined') {
            setActiveFormats({
                bold: document.queryCommandState("bold"),
                italic: document.queryCommandState("italic"),
                underline: document.queryCommandState("underline"),
            });
        }
    }, []);

    useEffect(() => {
        const update = () => updateActiveFormats();
        document.addEventListener("selectionchange", update);
        return () => document.removeEventListener("selectionchange", update);
    }, [updateActiveFormats]);

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
        updateActiveFormats();
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

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        // Do not force focus back, as it may reset selection/caret position
        // The onMouseDown(preventDefault) on buttons is sufficient to keep focus
        setIsDirty(true);
        // Small delay to let browser update selection/state
        setTimeout(updateActiveFormats, 10);
    };

    return (
        <div className="flex flex-col flex-1 h-full w-full min-h-[150px] font-win95 bg-win95-gray">
            {/* Notepad Toolbar */}
            <div className="flex items-center gap-1 p-1 border-b border-white shadow-[inset_-1px_-1px_0_0_#808080]">
                <button
                    onMouseDown={(e) => { e.preventDefault(); execCommand("bold"); }}
                    className={`win95-button w-8 h-8 font-bold text-[14px] flex items-center justify-center ${activeFormats.bold ? "win95-beveled-inset bg-gray-200" : ""}`}
                    title="Bold"
                    data-testid="notepad-bold"
                >
                    B
                </button>
                <button
                    onMouseDown={(e) => { e.preventDefault(); execCommand("italic"); }}
                    className={`win95-button w-8 h-8 italic text-[14px] font-serif flex items-center justify-center ${activeFormats.italic ? "win95-beveled-inset bg-gray-200" : ""}`}
                    title="Italic"
                    data-testid="notepad-italic"
                >
                    I
                </button>
                <button
                    onMouseDown={(e) => { e.preventDefault(); execCommand("underline"); }}
                    className={`win95-button w-8 h-8 underline text-[14px] flex items-center justify-center ${activeFormats.underline ? "win95-beveled-inset bg-gray-200" : ""}`}
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
                <span className="text-[12px] px-2 italic text-gray-600">Rich Text Mode</span>
            </div>

            {/* Editing Area */}
            <div className="flex-1 flex flex-col p-[2px] overflow-hidden min-h-0">
                <div className="flex-1 bg-white p-2 border-2 border-win95-gray-shadow shadow-[inset_2px_2px_0_0_#000000] overflow-auto min-h-0">
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        onMouseUp={updateActiveFormats}
                        onKeyUp={updateActiveFormats}
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
