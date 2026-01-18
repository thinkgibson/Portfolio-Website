import { getHomeContent } from "@/lib/markdown";

export async function Footer() {
    const content = await getHomeContent();
    const { socials } = content;

    return (
        <footer className="bg-bauhaus-black text-white py-12 border-t-4 border-bauhaus-yellow">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h4 className="text-2xl font-bold uppercase">Portfolio.</h4>
                    <p className="text-gray-400 mt-2">Designed with stricter geometry.</p>
                </div>
                <div className="flex gap-6">
                    {socials && socials.map((link: any) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="hover:text-bauhaus-yellow uppercase font-bold"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
