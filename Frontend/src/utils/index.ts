import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { setCookie } from "cookies-next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CookieOptionProps {
    path?: string;
    secure: boolean;
    expires: Date;
    httpOnly?: boolean;
    domain?: string;
    sameSite: boolean | "none" | "lax" | "strict";
}

type SetCookieProps = {
    cookieName: string;
    cookieValue: string;
    hours: number;
};

export let cookieOptions = {
    secure: true,
    sameSite: true,
} as CookieOptionProps;

export const setClientCookie = ({
    cookieName,
    cookieValue,
    hours,
}: SetCookieProps) => {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + hours * 60 * 60 * 1000);

    // const isDev = process.env.NODE_ENV === "development";

    cookieOptions = {
        ...cookieOptions,
        expires: expiryDate,
    };

    // if (isDev) {
    //     cookieOptions = {
    //         ...cookieOptions,
    //         sameSite: "lax",
    //         secure: false,
    //         httpOnly: false,
    //     };
    // }
    setCookie(cookieName, cookieValue, cookieOptions);
};

export const getDaysText = (days: string) => {
    if (days === "0") return "Today"
    if (days === "1") return "Tomorrow"
    return `In ${days} days`
}

export const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
}


export const formatDateWithTime = (input: string) => {
    const date = new Date(input);

    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();

    // Adding ordinal suffix (st, nd, rd, th)
    const suffix = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
    };

    const formattedDate = `${day}${suffix(day)} ${month} ${year}`;
    return formattedDate; 
}