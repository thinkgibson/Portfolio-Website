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
    };
}
