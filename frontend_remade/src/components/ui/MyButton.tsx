import "../../styles/global.css";
import "../../styles/utils.module.css";

import { ReactNode } from "react";

interface MyButtonProps {
  variant?: "primary" | "secondary";
  className?: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: {
    [key: string]: any;
  };
  type?: "button" | "submit" | "reset";
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
  style,
  type = "button",
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
    <div>
      <button
        type={type}
        className={`${myClass} ${className}`}
        onClick={handleClick}
        disabled={disabled}
        style={style}
      >
        {children}
      </button>
    </div>
  );
};

export default MyButton;
