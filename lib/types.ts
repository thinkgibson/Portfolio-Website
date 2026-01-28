
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
    jobHistory: JobHistory;
    skillsData: SkillsData;
}

export interface SkillsData {
    categories: {
        name: string;
        skills: string[];
    }[];
}

export interface JobHistory {
    jobs: {
        id: string;
        title: string;
        company: string;
        date: string;
        description: string;
        skills: string[];
    }[];
}

export type IconType =
    | "mycomputer"
    | "folder"
    | "inbox"
    | "user"
    | "programs"
    | "notepad"
    | "calculator"
    | "paint"
    | "terminal"
    | "musicplayer"
    | "documentaries"
    | "about"
    | "contact"
    | "projects"
    | "drive"
    | "floppy"
    | "job-history"
    | "skills";

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
