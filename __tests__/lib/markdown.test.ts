import { getHomeContent } from '../../lib/markdown';
import fs from 'fs';
import matter from 'gray-matter';
import { remark } from 'remark';

// Mock dependencies
jest.mock('fs');
jest.mock('gray-matter');

describe('markdown lib', () => {
    it('should read multiple files and process content', async () => {
        const mockProcessedContent = {
            toString: () => '<h1>About Body</h1>'
        };

        (fs.readFileSync as jest.Mock).mockReturnValue('mock content');
        
        // Mock matter to return different data based on input
        (matter as unknown as jest.Mock).mockImplementation((content: string) => {
            if (content === 'mock content') {
                return {
                    content: '# About Body',
                    data: {
                        hero: { title: 'Welcome Title' },
                        about: { title: 'About Title' },
                        projects: [{ id: '1' }],
                        contact: { email: 'test@example.com' }
                    }
                };
            }
            return { data: {} };
        });

        const mockProcess = jest.fn().mockResolvedValue(mockProcessedContent);
        const mockUse = jest.fn().mockReturnValue({ process: mockProcess });
        (remark as unknown as jest.Mock).mockReturnValue({ use: mockUse });

        const result = await getHomeContent();

        expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('welcome.md'), 'utf8');
        expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('aboutme.md'), 'utf8');
        expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('projects.md'), 'utf8');
        expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('contact.md'), 'utf8');
        
        expect(result.bodyHtml).toBe('<h1>About Body</h1>');
        expect(result.hero.title).toBe('Welcome Title');
        expect(result.about.title).toBe('About Title');
        expect(result.projects[0].id).toBe('1');
        expect(result.contact.email).toBe('test@example.com');
    });

    it('should throw error if file reading fails', async () => {
        (fs.readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('File not found');
        });

        await expect(getHomeContent()).rejects.toThrow('File not found');
    });
});
