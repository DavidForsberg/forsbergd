import styled, { useTheme } from "styled-components";
import Link from "next/link";
import { fontsizes, screenWidths } from "../../../utils/globalStyles";
import { useRouter } from "next/router";
import { useDarkMode } from "../../../utils/useDarkMode";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  width: 90%;
  height: 90%;
  list-style: none;
  @media only screen and (max-width: ${screenWidths.tablet}) {
    display: none;
  }
`;

const NavText = styled.a`
  color: ${({ theme }) => theme.primaryColor};
  text-decoration: none;
  font-size: ${fontsizes.small};
  font-weight: 500;
  cursor: pointer;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.3)};
  margin-left: 30px;
  border-right: ${({ theme, hasBorder }) =>
    hasBorder && `1px ${theme.primaryColor} solid`};
  padding-right: 30px;
`;

const MenuIconWrapper = styled.div`
  display: none;
  width: 100px;
  height: 100%;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: ${screenWidths.tablet}) {
    display: flex;
  }
`;

const links = [
  { id: 1, name: "Home", url: "/" },
  { id: 2, name: "Blog", url: "/posts" },
  { id: 3, name: "Portfolio", url: "/portfolio" },
];

const NavMenu = ({ toggleMenu }) => {
  const router = useRouter();
  const iconTheme = useTheme();
  const iconColor = iconTheme.primaryIconColor;

  return (
    <Wrapper>
      <NavList>
        {links.map((link) => {
          return (
            <Link key={link.id} href={link.url} passHref>
              <NavText
                isActive={router.pathname === link.url}
                hasBorder={link.id !== 3}
              >
                {link.name}
              </NavText>
            </Link>
          );
        })}
      </NavList>
      <MenuIconWrapper onClick={() => toggleMenu()}>
        <img
          src={`/icons/menu_${iconColor}.svg`}
          alt="toggle menu icon"
          style={{ width: 30, height: 30 }}
        />
      </MenuIconWrapper>
    </Wrapper>
  );
};

export default NavMenu;
