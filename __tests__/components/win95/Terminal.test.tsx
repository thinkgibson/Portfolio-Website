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

const renderTerminal = (props: any = {}) => {
    return render(
        <OSProvider
            onOpenWindow={props.onOpenApp || mockOpenWindow}
            onCloseWindow={props.onCloseApp || mockCloseWindow}
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
        const runButton = screen.getByTestId("terminal-run-button");

        fireEvent.change(input, { target: { value: "help" } });
        fireEvent.click(runButton);

        expect(screen.getByText(/Available commands:/i)).toBeInTheDocument();
        expect(screen.getByText(/open <app>/i)).toBeInTheDocument();
    });

    test("executes list command", () => {
        renderTerminal();
        const input = screen.getByRole("textbox");
        const runButton = screen.getByTestId("terminal-run-button");

        fireEvent.change(input, { target: { value: "list" } });
        fireEvent.click(runButton);

        expect(screen.getByText(/Running applications:/i)).toBeInTheDocument();
        expect(screen.getByText(/- notepad \(Notepad\)/i)).toBeInTheDocument();
    });

    test("executes open command", () => {
        const onOpenApp = jest.fn();
        renderTerminal({ onOpenApp });
        const input = screen.getByRole("textbox");
        const runButton = screen.getByTestId("terminal-run-button");

        // Enter a command
        fireEvent.change(input, { target: { value: "open calculator" } });
        fireEvent.click(runButton);

        expect(input).toHaveValue("");
        expect(screen.getByText(/Opening Calculator.../i)).toBeInTheDocument();
        expect(onOpenApp).toHaveBeenCalledWith("calculator");
    });

    test("executes close command", () => {
        const onCloseApp = jest.fn();
        renderTerminal({ onCloseApp });
        const input = screen.getByRole("textbox");
        const runButton = screen.getByTestId("terminal-run-button");

        // Enter a command
        fireEvent.change(input, { target: { value: "close notepad" } });
        fireEvent.click(runButton);

        expect(input).toHaveValue("");
        expect(screen.getByText(/Closing Notepad.../i)).toBeInTheDocument();
        expect(onCloseApp).toHaveBeenCalledWith("notepad");
    });

    test("handles unknown command", () => {
        renderTerminal();
        const input = screen.getByRole("textbox");
        const runButton = screen.getByTestId("terminal-run-button");

        fireEvent.change(input, { target: { value: "unknown" } });
        fireEvent.click(runButton);

        expect(input).toHaveValue("");
        expect(screen.getByText(/'unknown' is not recognized/i)).toBeInTheDocument();
    });

    test("navigates command history with arrow keys", () => {
        renderTerminal();
        const input = screen.getByRole("textbox");
        const runButton = screen.getByTestId("terminal-run-button");

        // Run commands
        fireEvent.change(input, { target: { value: "cmd1" } });
        fireEvent.click(runButton);

        fireEvent.change(input, { target: { value: "cmd2" } });
        fireEvent.click(runButton);

        // Press Up Arrow
        fireEvent.keyDown(input, { key: "ArrowUp", code: "ArrowUp" });
        expect(input).toHaveValue("cmd2");

        fireEvent.keyDown(input, { key: "ArrowUp", code: "ArrowUp" });
        expect(input).toHaveValue("cmd1");

        // Press Down Arrow
        fireEvent.keyDown(input, { key: "ArrowDown", code: "ArrowDown" });
        expect(input).toHaveValue("cmd2");

        fireEvent.keyDown(input, { key: "ArrowDown", code: "ArrowDown" });
        expect(input).toHaveValue("");
    });
});
