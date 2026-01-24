"use client";

import { useState, useEffect } from "react";
import { OSDesktop } from "./win95/OSDesktop";
import { Notepad } from "./win95/Notepad";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { Calculator } from "./win95/Calculator";
import { Paint } from "./win95/Paint";
import { Terminal } from "./win95/Terminal";
import { MusicPlayer } from "./win95/MusicPlayer";
import { Documentaries } from "./win95/Documentaries";

interface HomeContent {
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

export function HomeClient({ content }: { content: HomeContent }) {
    const windows: any[] = [
        {
            id: "welcome",
            title: "Welcome.txt",
            iconType: "about",
            helpContent: (
                <div className="space-y-2">
                    <p>This is the <strong>Welcome</strong> window.</p>
                    <p>It provides a brief introduction to the portfolio website and its Windows 95 theme.</p>
                    <p>Use the buttons in the title bar or the File menu to manage this window.</p>
                </div>
            ),
            content: (
                <div className="space-y-4">
                    <h1 className="text-[36px] font-win95 font-bold border-b-2 border-black pb-2 mb-4 leading-none" dangerouslySetInnerHTML={{ __html: content.hero.titleHtml }} />
                    <p className="text-[12px] font-win95 leading-tight">{content.hero.subtitle}</p>
                    <div className="flex gap-2 pt-4">
                        <button className="win95-button font-win95 font-bold text-[12px] px-4 h-6">
                            Learn More
                        </button>
                    </div>
                </div>
            )
        },
        {
            id: "about",
            title: "About_Me.doc",
            iconType: "about",
            helpContent: (
                <div className="space-y-2">
                    <p>This window contains the <strong>About Me</strong> section.</p>
                    <p>You can find information about my background, skills, and experience here.</p>
                    <p>The tech stack I use is highlighted in the right panel.</p>
                </div>
            ),
            content: (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <h2 className="text-[24px] font-win95 font-bold mb-4 bg-win95-blue-active text-white px-2 italic leading-none py-1">{content.about.title}</h2>
                        <div
                            className="text-[12px] font-win95 leading-normal space-y-4 [&>p]:mb-4"
                            dangerouslySetInnerHTML={{ __html: content.bodyHtml }}
                        />
                    </div>
                    <div className="win95-beveled p-4 h-fit">
                        <h3 className="font-win95 font-bold border-b border-black mb-2 text-[12px] uppercase leading-none">{content.about.techStackTitle}</h3>
                        <ul className="text-[12px] font-win95-mono space-y-1 leading-tight">
                            {content.skills.map((skill, i) => (
                                <li key={i} className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-win95-blue-active" />
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "projects",
            title: "My_Projects.exe",
            iconType: "projects",
            helpContent: (
                <div className="space-y-2">
                    <p>This is the <strong>Projects</strong> viewer.</p>
                    <p>Each box represents a project I've worked on. You can see the technologies used and links to demos or source code.</p>
                </div>
            ),
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        {content.projects.map((project) => (
                            <div key={project.id} className="win95-beveled p-3 flex flex-col md:flex-row gap-4 items-start">
                                <div className={`w-12 h-12 shrink-0 win95-beveled flex items-center justify-center font-bold text-white ${project.color === "red" ? "bg-red-800" : project.color === "blue" ? "bg-blue-800" : "bg-yellow-600"
                                    }`}>
                                    {project.title.charAt(0)}
                                </div>
                                <div className="flex-grow font-win95">
                                    <h3 className="font-bold underline text-blue-900 cursor-pointer text-[12px] leading-none">{project.title}</h3>
                                    <p className="text-[12px] uppercase font-bold text-gray-500 mb-1 leading-none">{project.category}</p>
                                    <p className="text-[12px] mb-2 leading-tight">{project.description}</p>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {project.technologies.map(t => (
                                            <span key={t} className="text-[12px] font-win95-mono border bg-gray-100 px-1 border-gray-400 leading-none">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        {project.link && (
                                            <a href={project.link} className="flex items-center gap-1 text-[10px] font-bold hover:underline">
                                                <ExternalLink size={10} /> Live Demo
                                            </a>
                                        )}
                                        {project.github && (
                                            <a href={project.github} className="flex items-center gap-1 text-[10px] font-bold hover:underline">
                                                <Github size={10} /> Source
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: "contact",
            title: "Contact_Information.txt",
            iconType: "contact",
            helpContent: (
                <div className="space-y-2">
                    <p>This window provides <strong>Contact Information</strong>.</p>
                    <p>Click the button to send me an email, or view the email address listed below.</p>
                </div>
            ),
            content: (
                <div className="text-center p-6 space-y-6 font-win95">
                    <h2 className="text-[24px] font-bold leading-none">{content.contact.title}</h2>
                    <p className="text-[12px]">{content.contact.description}</p>
                    <div className="flex justify-center">
                        <button
                            className="win95-button px-8 py-2 font-bold text-[12px]"
                            onClick={() => window.location.href = `mailto:${content.contact.email}`}
                        >
                            {content.contact.buttonText}
                        </button>
                    </div>
                    <div className="pt-4 border-t border-dotted border-gray-400 text-xs italic">
                        Email: {content.contact.email}
                    </div>
                </div>
            )
        },
        {
            id: "portfolio",
            title: "My Portfolio (C:)",
            iconType: "drive",
            helpContent: (
                <div className="space-y-2">
                    <p>This is the <strong>File Explorer</strong> for the portfolio.</p>
                    <p>It shows the directory structure and main folders of the project.</p>
                </div>
            ),
            content: (
                <div className="grid grid-cols-4 gap-4 p-4 text-center">
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-blue-100 p-2">
                        <div className="w-8 h-8 bg-yellow-400 win95-beveled" />
                        <span className="text-[10px]">Windows</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-blue-100 p-2">
                        <div className="w-8 h-8 bg-blue-400 win95-beveled" />
                        <span className="text-[10px]">Program Files</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-blue-100 p-2">
                        <div className="w-8 h-8 bg-green-400 win95-beveled" />
                        <span className="text-[10px]">My Documents</span>
                    </div>
                </div>
            )
        },
        {
            id: "notepad",
            title: "Notepad.exe",
            iconType: "notepad",
            fullBleed: true,
            width: 600,
            height: 400,
            helpContent: (
                <div className="space-y-2">
                    <p>This is the <strong>Notepad</strong> application.</p>
                    <p>You can use it to write and format text using the toolbar icons (Bold, Italic, Underline).</p>
                </div>
            ),
            content: <Notepad />
        },
        {
            id: "calculator",
            title: "Calculator.exe",
            iconType: "calculator",
            width: 260,
            height: 360,
            helpContent: (
                <div className="space-y-2">
                    <p>This is the <strong>Calculator</strong> application.</p>
                    <p>Perform basic arithmetic calculations.</p>
                </div>
            ),
            content: <Calculator />
        },
        {
            id: "paint",
            title: "Paint.exe",
            iconType: "paint",
            width: 700,
            height: 500,
            fullBleed: true,
            helpContent: (
                <div className="space-y-2">
                    <p>This is the <strong>Paint</strong> application.</p>
                    <p>Create simple drawings and save them.</p>
                </div>
            ),
            content: <Paint />
        },
        {
            id: "terminal",
            title: "Command Prompt",
            iconType: "terminal",
            width: 500,
            height: 350,
            helpContent: (
                <div className="space-y-2">
                    <p>This is the <strong>Command Prompt</strong>.</p>
                    <p>Type commands to interact with the OS. Supported: <code>help</code>, <code>open</code>, <code>list</code>, <code>close</code>, <code>restart</code>.</p>
                </div>
            ),
            content: <Terminal />
        },
        {
            id: "musicplayer",
            title: "Media Player",
            iconType: "musicplayer",
            width: 350,
            height: 450,
            helpContent: (
                <div className="space-y-2">
                    <p>This is the <strong>Media Player</strong>.</p>
                    <p>Listen to audio tracks from the system library.</p>
                </div>
            ),
            content: <MusicPlayer />
        },
        {
            id: "documentaries",
            title: "Documentaries",
            iconType: "documentaries",
            width: 800,
            height: 600,
            fullBleed: true,
            helpContent: (
                <div className="space-y-2">
                    <p>This is the <strong>Documentaries</strong> app.</p>
                    <p>Watch documentaries and videos I've worked on.</p>
                </div>
            ),
            content: <Documentaries />
        }
    ];

    return <OSDesktop windows={windows} />;
}
