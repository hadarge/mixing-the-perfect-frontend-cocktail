import React, { useEffect, useRef } from "react";

export interface BaseCustomElementProps {
    [key: string]: any;
}

export interface CustomElementComponentProps<T extends BaseCustomElementProps> {
    tagName: string;
    props: T;
}

/**
 * A generic wrapper for any custom element.
 */
export const CustomElement = <T extends BaseCustomElementProps>({ tagName, props }: CustomElementComponentProps<T>) => {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (ref.current) {
            Object.keys(props).forEach((key) => {
                // @ts-ignore: Allow setting custom element properties
                ref.current![key] = props[key];
            });
        }
    }, [props]);

    return React.createElement(tagName, { ref, ...props });
};
