"use client";

import React, { useEffect, useRef } from "react";
import { useOS } from "./OSContext";
import { Video } from "../../lib/types";

interface VideoGridProps {
    videos: Video[];
}

export function VideoGrid({ videos = [] }: VideoGridProps) {
    const { volume } = useOS();
    const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);

    useEffect(() => {
        // Update volume for all players when system volume changes
        iframeRefs.current.forEach(iframe => {
            if (iframe?.contentWindow) {
                iframe.contentWindow.postMessage(JSON.stringify({
                    event: "command",
                    func: "setVolume",
                    args: [volume]
                }), "*");
            }
        });
    }, [volume]);

    useEffect(() => {
        return () => {
            // Stop all videos on unmount
            iframeRefs.current.forEach(iframe => {
                if (iframe?.contentWindow) {
                    iframe.contentWindow.postMessage(JSON.stringify({
                        event: "command",
                        func: "stopVideo",
                        args: []
                    }), "*");
                }
            });
        };
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
                <div key={video.id + index} className="win95-group-box p-3 bg-win95-gray flex flex-col h-full">
                    <div className="text-[18px] font-bold mb-2 px-1 truncate" title={video.title}>
                        {video.title}
                    </div>

                    <div className="aspect-video w-full bg-black mb-3 border-2 border-win95-dark shadow-inner">
                        <iframe
                            ref={el => { iframeRefs.current[index] = el }}
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${video.id}${video.id.includes('?') ? '&' : '?'}enablejsapi=1`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>

                    <div className="px-1 space-y-2 flex-grow flex flex-col">
                        <div className="font-bold text-win95-blue-active text-[16px]">
                            {video.role}
                        </div>
                        <div className="text-[16px] leading-snug border-t border-win95-gray-inactive pt-2 flex-grow">
                            {video.description}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
