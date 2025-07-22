import React from "react";

declare namespace JSX {
    interface IntrinsicElements {
        'like-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            initialLikeCount?: string;
        };
    }
}
