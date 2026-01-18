import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    decoration?: "circle" | "square" | "triangle" | "none";
}

export function Card({ children, className, decoration = "none", ...props }: CardProps) {
    return (
        <div
            className={cn(
                "relative bg-white border-2 border-bauhaus-black p-6 shadow-hard-md hover:shadow-hard-xl transition-shadow",
                className
            )}
            {...props}
        >
            {decoration === "circle" && (
                <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-bauhaus-red" />
            )}
            {decoration === "square" && (
                <div className="absolute top-4 right-4 w-4 h-4 bg-bauhaus-blue" />
            )}
            {decoration === "triangle" && (
                <div className="absolute top-4 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-b-[16px] border-b-bauhaus-yellow border-r-[8px] border-r-transparent" />
            )}
            {children}
        </div>
    );
}
