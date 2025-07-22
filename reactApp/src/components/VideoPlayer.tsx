import {type BaseCustomElementProps, CustomElement} from "./Base.tsx";

interface VideoPlayerProps extends BaseCustomElementProps {
    "src": string;
    onPlay: () => void;
    onPause: () => void;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
    return <CustomElement tagName="video-player" props={props} />;
};