import "../../styles/global.css";
import { ReactNode } from "react";

interface MyButtonProps {
    variant?: "primary" | "secondary";
    children: ReactNode;
    href?: string;
}

const PRIMARY_BTN_CLASS = "my-btn-primary";
const SECONDARY_BTN_CLASS = "my-btn-secondary";

const MyButton = ({ variant, children, href }: MyButtonProps) => {
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
    };

    return (
        <button className={myClass} onClick={handleClick}>
            {children}
        </button>
    );
};

export default MyButton;
