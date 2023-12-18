import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import { SidebarContainer, SidebarItem, IconWrapper, Text } from "../styles/SidebarStyles";

type SidebarProps = {
    onToggle: (expanded: boolean) => void;
};

export function Sidebar({ onToggle }: SidebarProps) {
    const [expanded, setExpanded] = useState(false);

    const toggleSidebar = () => {
        const newExpandedState = !expanded;
        setExpanded(newExpandedState);
        onToggle(newExpandedState);
    };

    return (
        <SidebarContainer $expanded={expanded}>
            <SidebarItem to="/" onClick={toggleSidebar}>
                <IconWrapper>
                    <MenuIcon style={{ color: "#DDF2FD" }} />
                    <Text className="text-light" $expanded={expanded}>
                        Menu
                    </Text>
                </IconWrapper>
            </SidebarItem>

            <SidebarItem to="/">
                <IconWrapper>
                    <HomeIcon style={{ color: "#DDF2FD" }} />
                    <Text className="text-light" $expanded={expanded}>
                        Home
                    </Text>
                </IconWrapper>
            </SidebarItem>

            <SidebarItem to="/settings">
                <IconWrapper>
                    <SettingsIcon style={{ color: "#DDF2FD" }} />
                    <Text className="text-light" $expanded={expanded}>
                        Settings
                    </Text>
                </IconWrapper>
            </SidebarItem>

            <SidebarItem to="/notifications">
                <IconWrapper>
                    <NotificationsIcon style={{ color: "#DDF2FD" }} />
                    <Text className="text-light" $expanded={expanded}>
                        Notifications
                    </Text>
                </IconWrapper>
            </SidebarItem>
        </SidebarContainer>
    );
}
