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
            <div className="space-y-8 max-w-3xl mx-auto">
                <div className="bg-win95-beveled p-4 mb-6 text-center">
                    <h2 className="text-xl font-bold mb-2">Job History</h2>
                    <p className="text-sm">A timeline of my professional experience.</p>
                </div>

                <div className="space-y-6">
                    {data.jobs.map((job) => (
                        <div key={job.id} className="win95-group-box p-4 bg-win95-gray">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 border-b border-win95-gray-inactive pb-2">
                                <div>
                                    <h3 className="text-lg font-bold px-1">{job.title}</h3>
                                    <div className="text-win95-blue-active font-bold px-1 text-sm">{job.company}</div>
                                </div>
                                <div className="text-sm font-bold bg-win95-light border border-win95-dark px-2 py-1 shadow-inner mt-2 md:mt-0">
                                    {job.date}
                                </div>
                            </div>

                            <div className="px-1 space-y-4">
                                <p className="text-sm leading-relaxed">
                                    {job.description}
                                </p>

                                {job.skills && job.skills.length > 0 && (
                                    <div className="bg-win95-light p-2 border-2 border-win95-dark shadow-inner">
                                        <p className="text-xs font-bold mb-1 border-b border-gray-300 pb-1">Technologies & Skills:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {job.skills.map((skill, index) => (
                                                <span key={index} className="text-xs font-win95-mono bg-win95-gray border border-win95-dark px-1">
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
