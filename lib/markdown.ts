import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

export async function getHomeContent() {
    const fullPath = path.join(contentDirectory, 'home.md');
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const result = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(result.content);
    const contentHtml = processedContent.toString();

    // Load Job History content
    const jobHistoryPath = path.join(contentDirectory, 'job-history.md');
    const jobHistoryContents = fs.readFileSync(jobHistoryPath, 'utf8');
    const jobHistoryResult = matter(jobHistoryContents);

    // Load Skills content
    const skillsPath = path.join(contentDirectory, 'skills.md');
    const skillsContents = fs.readFileSync(skillsPath, 'utf8');
    const skillsResult = matter(skillsContents);

    // Load Video content
    const videoData = parseFeaturedVideos();

    return {
        bodyHtml: contentHtml,
        hero: result.data.hero,
        about: result.data.about,
        projects: result.data.projects,
        skills: result.data.skills,
        contact: result.data.contact,
        socials: result.data.socials,
        jobHistory: jobHistoryResult.data as any,
        skillsData: skillsResult.data as any,
        videoData,
    };
}

function parseFeaturedVideos() {
    const planningDirectory = path.join(process.cwd(), 'planning');
    const fullPath = path.join(planningDirectory, 'featured-videos.md');
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const lines = fileContents.split('\n');
    const videoData: { documentaries: any[], livestreams: any[] } = {
        documentaries: [],
        livestreams: []
    };

    let currentSection: 'documentaries' | 'essays' | 'livestreams' | null = null;
    let currentVideo: any = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === '# Documentaries #') {
            currentSection = 'documentaries';
            continue;
        } else if (line === '# Video Essays #') {
            currentSection = 'essays';
            continue;
        } else if (line === '# Livestreams #') {
            currentSection = 'livestreams';
            continue;
        }

        if (!currentSection || currentSection === 'essays') continue;

        if (line.startsWith('### ')) {
            if (currentVideo) {
                videoData[currentSection].push(currentVideo);
            }
            currentVideo = {
                title: line.replace('### ', '').trim(),
                id: '',
                role: '',
                description: ''
            };
        } else if (line.startsWith('https://www.youtube.com/watch?v=') || line.startsWith('https://www.youtube.com/playlist?list=')) {
            if (currentVideo) {
                if (line.includes('playlist?list=')) {
                    const listId = line.split('list=')[1].split('&')[0];
                    currentVideo.id = `videoseries?list=${listId}`;
                } else {
                    currentVideo.id = line.split('v=')[1].split('&')[0];
                }
            }
        } else if (line.startsWith('**')) {
            if (currentVideo) {
                currentVideo.role = line.replace(/\*\*/g, '').trim();
            }
        } else if (line.startsWith('*') && line.endsWith('*')) {
            if (currentVideo) {
                currentVideo.description = line.replace(/\*/g, '').trim();
            }
        } else if (line && !line.startsWith('#') && currentVideo) {
            // Check for multiline description or non-italicized description
            if (!currentVideo.description) {
                currentVideo.description = line;
            }
        }
    }

    if (currentVideo && currentSection && currentSection !== 'essays') {
        videoData[currentSection].push(currentVideo);
    }

    // Special case for Livestreams where a general role might be defined above the items
    const generalRoleLine = lines.find(l => l.includes('Overlay Designer, Stream Producer'));
    if (generalRoleLine) {
        const generalRole = generalRoleLine.replace(/\*\*/g, '').split('  ')[0].trim();
        videoData.livestreams.forEach(v => {
            if (!v.role) v.role = generalRole;
        });
    }

    return videoData;
}
