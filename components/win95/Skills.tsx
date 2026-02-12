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
            <div className="space-y-16 max-w-5xl mx-auto">
                <div className="bg-win95-beveled p-8 mb-12 text-center">
                    <h2 className="text-[36px] font-bold mb-4">Technical Skills</h2>
                    <p className="text-[21px]">Technologies and tools I use to build software.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.categories.map((category, idx) => (
                        <div key={idx} className="win95-group-box p-4 bg-win95-gray h-full">
                            <h3 className="text-[27px] font-bold mb-6 border-b-2 border-win95-gray-inactive pb-4 px-2">
                                {category.name}
                            </h3>
                            <div className="flex flex-wrap gap-4 px-2">
                                {category.skills.map((skill, sIdx) => (
                                    <span
                                        key={sIdx}
                                        className="text-[18px] font-win95-mono bg-win95-light border-2 border-win95-dark shadow-inner px-4 py-2"
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
