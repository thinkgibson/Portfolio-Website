"use client";

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Terminal } from "../../../components/win95/Terminal";
import { OSProvider } from "../../../components/win95/OSContext";

const mockOpenWindow = jest.fn();
const mockCloseWindow = jest.fn();
const runningApps = [{ id: "notepad", title: "Notepad" }];
const availableApps = [
    { id: "notepad", title: "Notepad" },
    { id: "calculator", title: "Calculator" }
];

const renderTerminal = () => {
    return render(
        <OSProvider
            onOpenWindow={mockOpenWindow}
            onCloseWindow={mockCloseWindow}
            runningApps={runningApps}
            availableApps={availableApps}
        >
            <Terminal />
        </OSProvider>
    );
};

describe("Terminal Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock scrollIntoView
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    test("renders terminal with initial message", () => {
        renderTerminal();
        expect(screen.getByText(/Portfolio OS \[Version 1.0\]/i)).toBeInTheDocument();
        expect(screen.getByText(/Type 'help' for available commands/i)).toBeInTheDocument();
    });

    test("executes help command", () => {
        renderTerminal();
        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "help" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        expect(screen.getByText(/Available commands:/i)).toBeInTheDocument();
        expect(screen.getByText(/open <app>/i)).toBeInTheDocument();
    });

    test("executes list command", () => {
        renderTerminal();
        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "list" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        expect(screen.getByText(/Running applications:/i)).toBeInTheDocument();
        expect(screen.getByText(/- notepad \(Notepad\)/i)).toBeInTheDocument();
    });

    test("executes open command", () => {
        renderTerminal();
        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "open calculator" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        expect(mockOpenWindow).toHaveBeenCalledWith("calculator");
        expect(screen.getByText(/Opening Calculator.../i)).toBeInTheDocument();
    });

    test("executes close command", () => {
        renderTerminal();
        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "close notepad" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        expect(mockCloseWindow).toHaveBeenCalledWith("notepad");
        expect(screen.getByText(/Closing Notepad.../i)).toBeInTheDocument();
    });

    test("handles unknown command", () => {
        renderTerminal();
        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "unknown" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        expect(screen.getByText(/'unknown' is not recognized/i)).toBeInTheDocument();
    });

    test("navigates command history with arrow keys", () => {
        renderTerminal();
        const input = screen.getByRole("textbox");

        // Enter a command
        fireEvent.change(input, { target: { value: "test-cmd" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        // Press Up Arrow
        fireEvent.keyDown(input, { key: "ArrowUp", code: "ArrowUp" });
        expect(input).toHaveValue("test-cmd");

        // Clear and press Down Arrow
        fireEvent.change(input, { target: { value: "" } });
        fireEvent.keyDown(input, { key: "ArrowDown", code: "ArrowDown" });
        expect(input).toHaveValue("");
    });
});
