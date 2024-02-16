import "../../styles/global.css";

import { ReactNode } from "react";

interface MyButtonProps {
    variant?: "primary" | "secondary";
    className?: string;
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
}

const PRIMARY_BTN_CLASS = ""; // default
const SECONDARY_BTN_CLASS = "my-btn-secondary";

const MyButton = ({
    variant,
    children,
    href,
    className,
    onClick,
    disabled,
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
        <button
            className={`${myClass} ${className}`}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default MyButton;
