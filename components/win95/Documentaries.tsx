"use client";

import React, { useEffect, useRef } from "react";
import { useOS } from "./OSContext";

interface Video {
    title: string;
    id: string;
    role: string;
    description: string;
}

const DOCUMENTARIES: Video[] = [
    {
        title: "Morristown Bank Vault Documentary",
        id: "ONw4XjhCiRg",
        role: "Producer, Director of Photography, & Editor",
        description: "Nestled inside a 150-year-old bank in northern New Jersey is one of the world's most unique arcades."
    },
    {
        title: "Iceland documentary",
        id: "uRnMK2wzM20",
        role: "Executive Producer, Production Coordinator, & Camera Operator",
        description: "An inside look at Iceland's most remote game jam."
    },
    {
        title: "Halo documentary",
        id: "YHbWDwLvJQo",
        role: "Executive Producer, Production Coordinator, & Camera Operator",
        description: "Hear the stories of the most prominent creators in the Halo: Custom Edition modding community."
    },
    {
        title: "The Making of Epitasis",
        id: "CSlaZOe_a8Q",
        role: "Executive Producer & Production Coordinator",
        description: "A behind the scenes look at the making of the 2019 Indie puzzler \"Epitasis\"."
    },
    {
        title: "The Making of SkateBIRD",
        id: "rNGpTAwXI8M",
        role: "Executive Producer",
        description: "An informal look at the inspirations and making of Glass Bottom Games' 2021 seminal bird-skater, SkateBIRD."
    }
];

export function Documentaries() {
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
            <div className="space-y-8 max-w-3xl mx-auto">
                <div className="bg-win95-beveled p-4 mb-6 text-center">
                    <h2 className="text-xl font-bold mb-2">My Documentaries</h2>
                    <p className="text-sm">A collection of documentaries I've worked on.</p>
                </div>

                {DOCUMENTARIES.map((video, index) => (
                    <div key={video.id} className="win95-group-box p-4 bg-win95-gray">
                        <div className="text-lg font-bold mb-2 px-1">{video.title}</div>

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

                        <div className="px-1 space-y-2">
                            <div className="font-bold text-win95-blue-active text-sm">
                                {video.role}
                            </div>
                            <div className="text-sm leading-relaxed border-t border-win95-gray-inactive pt-2">
                                {video.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
