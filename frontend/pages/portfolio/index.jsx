import styled from "styled-components";
import PageHead from "../../components/pageui/head";
import Icon from "../../components/pageui/icon";
import { NormalText, Title, TitleLine } from "../../components/pageui";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import Image from "next/image";
import Link from "next/link";

const Wrapper = styled.div`
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
  position: relative;
`;

const TopWrapper = styled.div`
  flex-direction: column;
  padding-top: 100px;
  padding-left: 100px;
  padding-right: 10%;
  padding-bottom: 100px;
  height: fit-content;

  p {
    font-size: 1.2rem;
    line-height: 150%;
    margin-top: 30px;
  }
`;

const ProjectStickyInfo = styled.div`
  flex-direction: column;
  padding-left: 80px;
  padding-top: 50px;
  color: ${({ theme }) => theme.primaryColor};
  width: 30%;

  h2 {
    font-weight: 400;
    font-size: 2.2rem;
  }

  h4 {
    font-weight: 400;
    font-size: 1.5rem;
    margin-top: 70px;
  }
`;

const ProjectNumber = styled.p`
  padding-bottom: 100px;
  font-weight: 600;
  font-size: 1.5rem;
  opacity: 0.7;
`;

const ProjectType = styled.p`
  padding-bottom: 50px;
  font-size: 1.5rem;
  font-weight: 400;
  margin-top: auto;

  a {
    color: ${({ theme }) => theme.primaryColor};
    margin-left: 10px;
  }
`;

const ProjectImageWrapper = styled.div`
  margin-left: auto;
  padding-right: calc(
    ${({ marginRight }) => (marginRight ? marginRight : 100)}px
  );
  @media only screen and (max-width: 1500px) {
    padding-right: calc(
      ${({ marginRight }) => (marginRight ? marginRight / 1.3 : 25)}px
    );
  }
`;

const Portfolio = () => {
  return (
    <Wrapper>
      <PageHead
        title="Web Developer Portfolio | Forsbergd"
        description="Web developer portfolio with some other code projects."
      />

      <Parallax pages={5} speed={3} style={{ position: "relative" }}>
        <ParallaxLayer>
          <TopWrapper>
            <div>
              <Icon prefix="portfolio" alt="blog icon" width="28" height="20" />
              <Title>Projects</Title>
            </div>
            <TitleLine />
            <NormalText>
              Check out the projects of mine which include web development, both
              front- and backend, UI/UX design, illustrations and finance
              related stuff.
            </NormalText>
          </TopWrapper>
        </ParallaxLayer>

        <ParallaxLayer speed={2} sticky={{ start: 0.7, end: 2.6 }}>
          <ProjectStickyInfo>
            <ProjectNumber>1</ProjectNumber>
            <h2>Gamla enskede plattsättning AB</h2>
            <h4>Front-end Developer | Administrator</h4>
            <p
              style={{
                fontWeight: 400,
                fontSize: "1.3rem",
                opacity: 0.7,
                marginTop: 15,
              }}
            >
              A website for a construction company located in Stockholm City.
              Developed with vanilla HTML, JavaScipt and CSS.
            </p>
            <ProjectType>
              Website |
              <Link href="https://gamlaenskedeplatt.se">
                <a>https://gamlaenskedeplatt.se</a>
              </Link>
            </ProjectType>
          </ProjectStickyInfo>
        </ParallaxLayer>

        <ParallaxLayer
          offset={1}
          speed={1}
          style={{
            justifyContent: "flex-end",
            width: "60%",
            marginLeft: "auto",
          }}
        >
          <Image
            src="/images/laptop_proj_1.png"
            width="1000"
            height="2000"
            objectFit="contain"
            priority
          />
        </ParallaxLayer>
        <ParallaxLayer
          offset={2}
          speed={1}
          style={{
            justifyContent: "flex-end",
            marginTop: -300,
          }}
        >
          <ProjectImageWrapper marginRight={400}>
            <Image
              src="/images/iphone_proj_1_1.png"
              width={300}
              height={400}
              objectFit="contain"
              priority
            />
          </ProjectImageWrapper>
        </ParallaxLayer>
        <ParallaxLayer
          offset={2}
          speed={2.5}
          style={{ justifyContent: "flex-end", marginTop: 200 }}
        >
          <ProjectImageWrapper>
            <Image
              src="/images/iphone_proj_1_2.png"
              width={300}
              height={500}
              objectFit="contain"
              priority
            />
          </ProjectImageWrapper>
        </ParallaxLayer>
        <ParallaxLayer
          offset={2}
          speed={1.5}
          style={{ justifyContent: "flex-end", marginTop: -400 }}
        >
          <ProjectImageWrapper>
            <Image
              src="/images/iphone_proj_1_3.png"
              width={300}
              height={400}
              objectFit="contain"
              priority
            />
          </ProjectImageWrapper>
        </ParallaxLayer>
        <ParallaxLayer
          offset={2}
          speed={2}
          style={{ justifyContent: "flex-end", marginTop: 400 }}
        >
          <ProjectImageWrapper marginRight={400}>
            <Image
              src="/images/iphone_proj_1_4.png"
              width={300}
              height={400}
              objectFit="contain"
              priority
            />
          </ProjectImageWrapper>
        </ParallaxLayer>
        <ParallaxLayer
          offset={3.9}
          speed={0}
          style={{ justifyContent: "center", marginTop: 100 }}
        >
          <img
            style={{ position: "absolute", bottom: 0, width: "50%" }}
            src="/images/rocket.svg"
            alt="rocket"
          />
        </ParallaxLayer>
      </Parallax>
    </Wrapper>
  );
};

export default Portfolio;
