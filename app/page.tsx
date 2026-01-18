import { getHomeContent } from "@/lib/markdown";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
    const content = await getHomeContent();
    return <HomeClient content={content as any} />;
}
