"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps {
    variant?: "primary" | "secondary" | "accent" | "outline";
    shape?: "square" | "pill";
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export function Button({
    children,
    className,
    variant = "primary",
    shape = "square",
    onClick,
    type = "button",
    disabled = false,
}: ButtonProps) {
    const baseStyles = "font-bold uppercase tracking-wider border-2 border-bauhaus-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

    const variants = {
        primary: "bg-bauhaus-red text-white shadow-hard-md hover:shadow-hard-lg",
        secondary: "bg-bauhaus-blue text-white shadow-hard-md hover:shadow-hard-lg",
        accent: "bg-bauhaus-yellow text-bauhaus-black shadow-hard-md hover:shadow-hard-lg",
        outline: "bg-transparent text-bauhaus-black shadow-hard-sm hover:bg-bauhaus-offwhite"
    };

    const shapes = {
        square: "rounded-none px-6 py-3",
        pill: "rounded-full px-8 py-3"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], shapes[shape], className)}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
}
