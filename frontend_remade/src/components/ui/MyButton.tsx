import "../../styles/global.css";

import { ReactNode } from "react";

interface MyButtonProps {
    variant?: "primary" | "secondary";
    className?: string;
    children: ReactNode;
    href?: string;
    onClick?: () => void;
}

const PRIMARY_BTN_CLASS = ""; // default
const SECONDARY_BTN_CLASS = "my-btn-secondary";

const MyButton = ({
    variant,
    children,
    href,
    className,
    onClick,
}: MyButtonProps) => {
    let myClass: string = PRIMARY_BTN_CLASS;

    if (variant == "primary") {
        myClass = PRIMARY_BTN_CLASS;
    } else if (variant == "secondary") {
        myClass = SECONDARY_BTN_CLASS;
    }

    const handleClick = () => {
        if (href) {
            window.location.href = href;
        }

        if (onClick) {
            onClick();
        }
    };

    return (
        <button className={`${myClass} ${className}`} onClick={handleClick}>
            {children}
        </button>
    );
};

export default MyButton;
