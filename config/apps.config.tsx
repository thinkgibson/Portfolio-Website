
import React from 'react';
import { AppDefinition, HomeContent } from '../lib/types';
import { Notepad } from "../components/win95/Notepad";
import { Calculator } from "../components/win95/Calculator";
import { Paint } from "../components/win95/Paint";
import { Terminal } from "../components/win95/Terminal";
import { MusicPlayer } from "../components/win95/MusicPlayer";
import { Documentaries } from "../components/win95/Documentaries";
import { VideoEssays } from "../components/win95/VideoEssays";
import { Livestreams } from "../components/win95/Livestreams";
import { JobHistory } from "../components/win95/JobHistory";
import { Skills } from "../components/win95/Skills";
import { Github, ExternalLink } from "lucide-react";

export const getAppsConfig = (content: HomeContent): AppDefinition[] => {
    return [
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
                    <h1 className="text-[72px] font-win95 font-bold border-b-4 border-black pb-4 mb-8 leading-none" dangerouslySetInnerHTML={{ __html: content.hero.titleHtml }} />
                    <p className="text-[24px] font-win95 leading-tight">{content.hero.subtitle}</p>
                    <div className="flex gap-4 pt-8">
                        <button className="win95-button font-win95 font-bold text-[24px] px-8 h-12">
                            Learn More
                        </button>
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
                    <h2 className="text-[48px] font-bold leading-none">{content.contact.title}</h2>
                    <p className="text-[24px]">{content.contact.description}</p>
                    <div className="flex justify-center">
                        <button
                            className="win95-button px-16 py-4 font-bold text-[24px]"
                            onClick={() => window.location.href = `mailto:${content.contact.email}`}
                        >
                            {content.contact.buttonText}
                        </button>
                    </div>
                    <div className="pt-8 border-t border-dotted border-gray-400 text-xl italic">
                        Email: {content.contact.email}
                    </div>
                </div>
            )
        },
        {
            id: "portfolio",
            title: "My Portfolio",
            iconType: "folder",
            fullBleed: true,
            width: 600,
            height: 450,
            children: [
                {
                    id: "documentaries",
                    title: "Documentaries",
                    iconType: "documentaries",
                    width: '120vh',
                    height: '75vh',
                    fullBleed: false,
                    helpContent: (
                        <div className="space-y-2">
                            <p>This is the <strong>Documentaries</strong> app.</p>
                            <p>Watch documentaries and videos I've worked on.</p>
                        </div>
                    ),
                    content: <Documentaries videos={content.videoData.documentaries} />
                },
                {
                    id: "video-essays",
                    title: "Video Essays",
                    iconType: "video-essays",
                    width: '120vh',
                    height: '75vh',
                    fullBleed: false,
                    helpContent: (
                        <div className="space-y-2">
                            <p>This is the <strong>Video Essays</strong> app.</p>
                            <p>Watch video essays I've produced.</p>
                        </div>
                    ),
                    content: <VideoEssays videos={content.videoData.essays} />
                },
                {
                    id: "livestreams",
                    title: "Livestreams",
                    iconType: "livestreams",
                    width: '120vh',
                    height: '75vh',
                    fullBleed: false,
                    helpContent: (
                        <div className="space-y-2">
                            <p>This is the <strong>Livestreams</strong> app.</p>
                            <p>Watch archives of past livestreams.</p>
                        </div>
                    ),
                    content: <Livestreams videos={content.videoData.livestreams} />
                }
            ]
        },
        {
            id: "resume-folder",
            title: "My Resume",
            iconType: "folder",
            fullBleed: true,
            width: 500,
            height: 400,
            children: [
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
                        <div className="p-4">
                            <h2 className="text-[48px] font-win95 font-bold mb-8 bg-win95-blue-active text-white px-4 italic leading-none py-2">{content.about.title}</h2>
                            <div
                                className="text-[24px] font-win95 leading-normal space-y-8 [&>p]:mb-8"
                                dangerouslySetInnerHTML={{ __html: content.bodyHtml }}
                            />
                        </div>
                    )
                },
                {
                    id: "job-history",
                    title: "Job History",
                    iconType: "job-history",
                    helpContent: (
                        <div className="space-y-2">
                            <p>This is the <strong>Job History</strong> viewer.</p>
                            <p>It displays a timeline of my professional experience and skills.</p>
                        </div>
                    ),
                    content: <JobHistory data={content.jobHistory} />
                },
                {
                    id: "skills",
                    title: "My Skills",
                    iconType: "skills",
                    helpContent: (
                        <div className="space-y-2">
                            <p>This is the <strong>Skills</strong> viewer.</p>
                            <p>It displays my technical expertise categorized by area.</p>
                        </div>
                    ),
                    content: <Skills data={content.skillsData} />
                }
            ]
        },
        {
            id: "accessories",
            title: "Accessories",
            iconType: "folder",
            fullBleed: true,
            width: 500,
            height: 400,
            children: [
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
                    width: 230,
                    height: 400,
                    lockAspectRatio: true,
                    minWidth: 230,
                    minHeight: 400,
                    canMaximize: false,
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
                }
            ]
        },
        {
            id: "multimedia",
            title: "Multimedia",
            iconType: "folder",
            fullBleed: true,
            width: 500,
            height: 400,
            children: [
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
                }
            ]
        }
    ];
};
