import styled from "styled-components";
import { screenWidths } from "../../utils/globalStyles";
import NavMenu from "./navmenu";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 10%;
  box-shadow: ${({ theme }) => theme.primaryShadow};
  z-index: 10;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.primaryColor};

  @media only screen and (max-width: 1100px) {
    height: 10vh;
    position: fixed;
    background-color: ${({ theme }) => theme.primaryBackground};
  }
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  width: 90%;
  height: 100%;
  @media only screen and (max-width: ${screenWidths.tablet}) {
    width: 100%;
  }
`;

const ThemeToggleWrapper = styled.div`
  position: absolute;
  left: 0px;
`;

const Header = ({ toggleMenu, themeToggler }) => {
  return (
    <Wrapper>
      <InnerWrapper>
        <ThemeToggleWrapper>{themeToggler}</ThemeToggleWrapper>
        <NavMenu toggleMenu={() => toggleMenu()} />
      </InnerWrapper>
    </Wrapper>
  );
};

export default Header;
