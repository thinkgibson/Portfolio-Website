"use client";

import React, { useEffect, useRef } from "react";
import { useOS } from "./OSContext";
import { Video } from "../../lib/types";

interface DocumentariesProps {
    videos: Video[];
}

export function Documentaries({ videos = [] }: DocumentariesProps) {
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
        <div className="h-full overflow-y-auto bg-win95-light p-4 font-win95 select-text">
            <div className="space-y-16 max-w-5xl mx-auto">
                <div className="bg-win95-beveled p-8 mb-12 text-center">
                    <h2 className="text-[36px] font-bold mb-4">My Documentaries</h2>
                    <p className="text-[21px]">A collection of documentaries I've worked on.</p>
                </div>

                {videos.map((video, index) => (
                    <div key={video.id} className="win95-group-box p-4 bg-win95-gray">
                        <div className="text-[27px] font-bold mb-4 px-2">{video.title}</div>

                        <div className="aspect-video w-full bg-black mb-4 border-2 border-win95-dark shadow-inner">
                            <iframe
                                ref={el => { iframeRefs.current[index] = el }}
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1`}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>

                        <div className="px-2 space-y-4">
                            <div className="font-bold text-win95-blue-active text-[21px]">
                                {video.role}
                            </div>
                            <div className="text-[21px] leading-relaxed border-t border-win95-gray-inactive pt-4">
                                {video.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
