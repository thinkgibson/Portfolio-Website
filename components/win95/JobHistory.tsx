import React from "react";
import { JobHistory as JobHistoryType } from "../../lib/types";

interface JobHistoryProps {
    data: JobHistoryType;
}

export function JobHistory({ data }: JobHistoryProps) {
    // If no data or jobs, show a friendly message
    if (!data?.jobs?.length) {
        return (
            <div className="h-full bg-win95-light p-4 font-win95 flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-2">No job history found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-win95-light p-4 font-win95 select-text">
            <div className="space-y-16 max-w-5xl mx-auto">
                <div className="bg-win95-beveled p-8 mb-12 text-center">
                    <h2 className="text-[36px] font-bold mb-4">Job History</h2>
                    <p className="text-[21px]">A timeline of my professional experience.</p>
                </div>

                <div className="space-y-6">
                    {data.jobs.map((job) => (
                        <div key={job.id} className="win95-group-box p-4 bg-win95-gray">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 border-b border-win95-gray-inactive pb-2">
                                <div>
                                    <h3 className="text-[27px] font-bold px-2">{job.title}</h3>
                                    <div className="text-win95-blue-active font-bold px-2 text-[21px]">{job.company}</div>
                                </div>
                                <div className="text-[21px] font-bold bg-win95-light border-2 border-win95-dark px-4 py-2 shadow-inner mt-4 md:mt-0">
                                    {job.date}
                                </div>
                            </div>

                            <div className="px-2 space-y-8">
                                <p className="text-[21px] leading-relaxed">
                                    {job.description}
                                </p>

                                {job.skills && job.skills.length > 0 && (
                                    <div className="bg-win95-light p-4 border-2 border-win95-dark shadow-inner">
                                        <p className="text-[18px] font-bold mb-2 border-b border-gray-300 pb-2">Technologies & Skills:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.map((skill, index) => (
                                                <span key={index} className="text-[18px] font-win95-mono bg-win95-gray border border-win95-dark px-2">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
