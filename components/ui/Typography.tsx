import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
}

export function H1({ children, className, as: Component = "h1", ...props }: TypographyProps) {
    return (
        <Component className={cn("text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none", className)} {...props}>
            {children}
        </Component>
    );
}

export function H2({ children, className, as: Component = "h2", ...props }: TypographyProps) {
    return (
        <Component className={cn("text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-6", className)} {...props}>
            {children}
        </Component>
    );
}

export function H3({ children, className, as: Component = "h3", ...props }: TypographyProps) {
    return (
        <Component className={cn("text-xl md:text-2xl font-bold uppercase tracking-wide", className)} {...props}>
            {children}
        </Component>
    );
}

export function P({ children, className, as: Component = "p", ...props }: TypographyProps) {
    return (
        <Component className={cn("text-base md:text-lg leading-relaxed text-gray-800", className)} {...props}>
            {children}
        </Component>
    );
}
