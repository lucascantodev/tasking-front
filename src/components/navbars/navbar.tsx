import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";


export function Root(
    { className, children, ...props }: 
    Readonly<{ className?: string, children?: ReactNode[] | ReactNode, props?: any[] }>
) 
{
    return (
        <nav className={cn("flex", className)} {...props}>
            {children}
        </nav>
    );
}

export function Route(
    { href, target="_self", className, children, ...props }: 
    Readonly<{ 
        href: string, 
        target?: string, 
        className?: string, 
        children?: ReactNode[] | ReactNode, 
        props?: any[] 
    }>
) 
{
    return (
        <Link 
            href={href}
            target={target}
            className={cn(`
                flex justify-center items-center
                gap-[8px] rounded-[5px] p-[3px] border-[1px] border-foreground
            `, className)}
            {...props}
        >
            {children}
        </Link>
    );
}