import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Portfolio OS",
    description: "A Windows 95 inspired portfolio experience.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="">
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
