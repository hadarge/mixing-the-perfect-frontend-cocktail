import {type BaseCustomElementProps, CustomElement} from "./Base.tsx";

interface LikeButtonProps extends BaseCustomElementProps {
    "initial-like-count": string;
    onLikeChange: (isLiked: boolean, likeCount: number) => void;
}

export const LikeButton = (props: LikeButtonProps) => {
    return <CustomElement tagName="like-button" props={props} />;
};