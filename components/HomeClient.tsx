"use client";

import { useState, useEffect } from "react";
import { OSDesktop } from "./win95/OSDesktop";
import { getAppsConfig } from "../config/apps.config";
import { HomeContent } from "../lib/types";

export function HomeClient({ content }: { content: HomeContent }) {
    const windows = getAppsConfig(content);

    return <OSDesktop windows={windows} />;
}

