import type { SVGProps } from 'react';

export function PrescriptionIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M19 3v4.08a2.5 2.5 0 0 1-2.16 2.45L5.36 12a2.5 2.5 0 0 1-1.6-4.52L12 5.3" />
            <path d="M10.4 7.4L9.2 6.8" />
            <path d="m14 9-2-4" />
            <path d="M10 13.5V19a2 2 0 0 0 2 2h4" />
            <path d="M16 19v-5.5" />
            <path d="M14 16h4" />
        </svg>
    )
}
