import React from "react";
import { SkillsData } from "../../lib/types";

interface SkillsProps {
    data: SkillsData;
}

export function Skills({ data }: SkillsProps) {
    if (!data?.categories?.length) {
        return (
            <div className="h-full bg-win95-light p-4 font-win95 flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-2">No skills data found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-win95-light p-4 font-win95 select-text">
            <div className="space-y-8 max-w-3xl mx-auto">
                <div className="bg-win95-beveled p-4 mb-6 text-center">
                    <h2 className="text-xl font-bold mb-2">Technical Skills</h2>
                    <p className="text-sm">Technologies and tools I use to build software.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.categories.map((category, idx) => (
                        <div key={idx} className="win95-group-box p-4 bg-win95-gray h-full">
                            <h3 className="text-lg font-bold mb-3 border-b border-win95-gray-inactive pb-2 px-1">
                                {category.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 px-1">
                                {category.skills.map((skill, sIdx) => (
                                    <span
                                        key={sIdx}
                                        className="text-xs font-win95-mono bg-win95-light border-2 border-win95-dark shadow-inner px-2 py-1"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
