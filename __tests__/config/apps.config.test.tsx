
import React from 'react';
import { getAppsConfig } from '../../config/apps.config';
import { HomeContent } from '../../lib/types';

describe('apps.config', () => {
    const mockContent: HomeContent = {
        hero: {
            titleHtml: 'Test Hero',
            subtitle: 'Test Subtitle',
            buttonPrimary: 'Button 1',
            buttonSecondary: 'Button 2'
        },
        about: {
            title: 'About Me',
            techStackTitle: 'Tech Stack'
        },
        projects: [
            {
                id: 'project-1',
                title: 'Project 1',
                category: 'Category 1',
                description: 'Description 1',
                technologies: ['React', 'Node'],
                color: 'blue'
            }
        ],
        skills: ['Skill 1', 'Skill 2'],
        contact: {
            title: 'Contact',
            description: 'Contact Description',
            buttonText: 'Send Email',
            email: 'test@example.com'
        },
        bodyHtml: '<p>Body Content</p>'
    };

    it('returns a list of apps', () => {
        const apps = getAppsConfig(mockContent);
        expect(Array.isArray(apps)).toBe(true);
        expect(apps.length).toBeGreaterThan(0);
    });

    it('includes essential apps', () => {
        const apps = getAppsConfig(mockContent);
        const appIds = apps.map(app => app.id);

        expect(appIds).toContain('welcome');
        expect(appIds).toContain('about');
        expect(appIds).toContain('projects');
        expect(appIds).toContain('contact');
        expect(appIds).toContain('portfolio');
        expect(appIds).toContain('accessories');
        expect(appIds).toContain('multimedia');
    });

    it('transforms content into app structure', () => {
        const apps = getAppsConfig(mockContent);
        const projectsApp = apps.find(app => app.id === 'projects');

        // We can't easily deep check the React node content without rendering, 
        // but we can check if content is defined.
        expect(projectsApp?.content).toBeDefined();
    });

    it('defines children for folders', () => {
        const apps = getAppsConfig(mockContent);
        const accessories = apps.find(app => app.id === 'accessories');

        expect(accessories).toBeDefined();
        expect(accessories?.children).toBeDefined();
        expect(accessories?.children?.length).toBeGreaterThan(0);

        const notepad = accessories?.children?.find(child => child.id === 'notepad');
        expect(notepad).toBeDefined();
        expect(notepad?.iconType).toBe('notepad');
    });
});
