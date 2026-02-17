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
