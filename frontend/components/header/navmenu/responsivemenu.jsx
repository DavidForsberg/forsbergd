import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { fontsizes, screenWidths } from "../../../utils/globalStyles";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 90%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  padding-top: 10vh;

  @media only screen and (max-width: ${screenWidths.phone}) {
    flex-direction: column-reverse;
    justify-content: flex-end;
    justify-content: space-between;
  }
`;

const QuoteWrapper = styled.div`
  width: 30%;
  height: fit-content;
  margin-top: 60px;
  @media only screen and (max-width: ${screenWidths.phone}) {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 0px;
  }
`;

const QuoteImage = styled.div`
  max-width: 100%;
  @media only screen and (max-width: ${screenWidths.phone}) {
    max-width: 55% !important;
    object-fit: contain;
  }
`;

const NavMenu = styled.nav`
  display: flex;
  width: 50%;
  height: 80%;
  @media only screen and (max-width: ${screenWidths.phone}) {
    width: 80%;
    height: fit-content;
  }
`;

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  padding-top: 30px;
  @media only screen and (max-width: ${screenWidths.phone}) {
    padding-top: 10px;
  }
`;

const LinkItem = styled.a`
  padding: 30px 0px;
  width: 100%;
  text-align: right;
  @media only screen and (max-width: ${screenWidths.phone}) {
    padding: 15px 0px;
  }
  color: ${({ theme }) => theme.primaryColor};
  font-size: ${fontsizes.title};
  padding: 5px 0px;
  padding-left: 10px;
  @media only screen and (max-width: ${screenWidths.phone}) {
    font-size: ${fontsizes.small};
  }
`;

const links = [
  { id: 1, name: "Blog", url: "/posts" },
  { id: 2, name: "Home", url: "/" },
  { id: 3, name: "Portfolio", url: "/portfolio" },
];

const ResponsiveMenu = ({ toggleMenu }) => {
  const router = useRouter();

  return (
    <Wrapper>
      <QuoteWrapper>
        <QuoteImage>
          <Image
            src="/images/responsive_menu_img.jpg"
            width={640}
            height={960}
            priority
            alt="Responsive menu image"
          />
        </QuoteImage>
      </QuoteWrapper>
      <NavMenu>
        <LinkList>
          {links.map((link) => {
            return (
              <Link key={link.id} href={link.url} passHref>
                <LinkItem
                  isActive={router.pathname == link.url}
                  onClick={() => toggleMenu()}
                >
                  {link.name}
                </LinkItem>
              </Link>
            );
          })}
        </LinkList>
      </NavMenu>
    </Wrapper>
  );
};

export default ResponsiveMenu;
