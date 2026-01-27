import React from "react";
import * as Icons from "./index";
import iconsConfig from "../../config/icons.json";

// Derive IconType from the keys in icons.json
export type IconType = keyof typeof iconsConfig;

// Map JSON keys to React Components
export const iconRegistry: Record<IconType, React.ComponentType<Icons.IconProps>> = {
    "mycomputer": Icons.MyComputerIcon,
    "folder": Icons.FolderIcon,
    "inbox": Icons.InboxIcon,
    "user": Icons.UserIcon,
    "programs": Icons.ProgramsIcon,
    "notepad": Icons.NotepadIcon,
    "calculator": Icons.CalculatorIcon,
    "paint": Icons.PaintIcon,
    "terminal": Icons.TerminalIcon,
    "musicplayer": Icons.MusicPlayerIcon,
    "documentaries": Icons.DocumentariesIcon,
    // Aliases/Duplicates as per original intent or fallback
    "about": Icons.UserIcon,
    "contact": Icons.InboxIcon,
    "projects": Icons.ProgramsIcon,
    "drive": Icons.MyComputerIcon,
    "floppy": Icons.FloppyIcon,
    "job-history": Icons.NotepadIcon,
};
