import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const SidebarContainer = styled.div<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? "300px" : "65px")};
  height: 100vh;
  background-color: var(--primary-color);
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  transition: width 0.3s ease-in-out;
  z-index: 1050;
`;

export const SidebarItem = styled(NavLink)`
  padding: 10px 15px;
  color: var(--light-color); /* Light Color */
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  &:hover {
    background-color: var(--secondary-color); /* Secondary Color */
  }
`;

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export const Text = styled.span<{ expanded: boolean }>`
  margin-left: 15px;
  display: ${({ expanded }) => (expanded ? "inline" : "none")};
`;
