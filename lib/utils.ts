import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppDefinition } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function sortAppDefinitions(items: AppDefinition[]): AppDefinition[] {
    return [...items].sort((a, b) => {
        const aIsFolder = a.children && a.children.length > 0;
        const bIsFolder = b.children && b.children.length > 0;

        // Primary sort: Folders first
        if (aIsFolder && !bIsFolder) return -1;
        if (!aIsFolder && bIsFolder) return 1;

        // Secondary sort: Alphabetical by title
        return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
    });
}

export function replaceBootVariables(message: string, userData: {
    browser: string;
    os: string;
    viewport: string;
    ip: string;
    date: string;
}) {
    return message
        .replace(/{{browser}}/g, userData.browser)
        .replace(/{{os}}/g, userData.os)
        .replace(/{{viewport}}/g, userData.viewport)
        .replace(/{{ip}}/g, userData.ip)
        .replace(/{{date}}/g, userData.date);
}
