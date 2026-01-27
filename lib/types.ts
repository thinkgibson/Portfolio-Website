
import React from 'react';

export interface HomeContent {
    hero: {
        titleHtml: string;
        subtitle: string;
        buttonPrimary: string;
        buttonSecondary: string;
    };
    about: {
        title: string;
        techStackTitle: string;
    };
    projects: {
        id: string;
        title: string;
        category: string;
        description: string;
        technologies: string[];
        link?: string;
        github?: string;
        color: "red" | "blue" | "yellow";
    }[];
    skills: string[];
    contact: {
        title: string;
        description: string;
        buttonText: string;
        email: string;
    };
    bodyHtml: string;
}

export type IconType =
    | "folder"
    | "about"
    | "contact"
    | "projects"
    | "drive"
    | "notepad"
    | "calculator"
    | "paint"
    | "terminal"
    | "musicplayer"
    | "documentaries";

export interface AppDefinition {
    id: string;
    title: string;
    iconType: IconType;
    content?: React.ReactNode;
    helpContent?: React.ReactNode;
    width?: number;
    height?: number;
    fullBleed?: boolean;
    lockAspectRatio?: boolean;
    minWidth?: number;
    minHeight?: number;
    canMaximize?: boolean;
    children?: AppDefinition[];
    // Initial position preference (optional)
    x?: number;
    y?: number;
}
