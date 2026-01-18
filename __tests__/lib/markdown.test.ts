import { getHomeContent } from '../../lib/markdown';
import fs from 'fs';
import matter from 'gray-matter';
import { remark } from 'remark';

// Mock dependencies
jest.mock('fs');
jest.mock('gray-matter');

describe('markdown lib', () => {
    it('should read home.md and process content', async () => {
        const mockFileContent = 'mock content';
        const mockMatterResult = {
            content: '# Mock Body',
            data: {
                hero: { title: 'Hero Title' },
                about: 'About info',
                projects: [],
                skills: [],
                contact: {},
                socials: {}
            }
        };
        const mockProcessedContent = {
            toString: () => '<h1>Mock Body</h1>'
        };

        (fs.readFileSync as jest.Mock).mockReturnValue(mockFileContent);
        (matter as unknown as jest.Mock).mockReturnValue(mockMatterResult);

        const mockProcess = jest.fn().mockResolvedValue(mockProcessedContent);
        const mockUse = jest.fn().mockReturnValue({ process: mockProcess });
        (remark as unknown as jest.Mock).mockReturnValue({ use: mockUse });

        const result = await getHomeContent();

        expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('home.md'), 'utf8');
        expect(matter).toHaveBeenCalledWith(mockFileContent);
        expect(result.bodyHtml).toBe('<h1>Mock Body</h1>');
        expect(result.hero.title).toBe('Hero Title');
    });

    it('should throw error if file reading fails', async () => {
        (fs.readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('File not found');
        });

        await expect(getHomeContent()).rejects.toThrow('File not found');
    });
});
