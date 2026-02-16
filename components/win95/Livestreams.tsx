"use client";

import React from "react";
import { Video } from "../../lib/types";
import { VideoGrid } from "./VideoGrid";

interface LivestreamsProps {
    videos: Video[];
}

export function Livestreams({ videos = [] }: LivestreamsProps) {
    return (
        <div className="h-full overflow-y-auto bg-win95-light p-4 font-win95 select-text">
            <div className="space-y-8 max-w-6xl mx-auto">
                <div className="bg-win95-beveled p-8 mb-8 text-center bg-win95-gray">
                    <h2 className="text-[36px] font-bold mb-4">My Livestreams</h2>
                    <p className="text-[21px]">A collection of livestreams and archives.</p>
                </div>

                <VideoGrid videos={videos} />
            </div>
        </div>
    );
}
