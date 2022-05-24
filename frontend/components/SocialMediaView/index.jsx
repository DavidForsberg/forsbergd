import styled from "styled-components";
import { fontsizes, screenWidths } from "../../utils/globalStyles";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  @media only screen and (max-width: ${screenWidths.tablet}) {
    flex-direction: column;
  }
  @media only screen and (max-width: ${screenWidths.phone}) {
    flex-direction: column;
    // height: fit-content;
  }
`;

const LeftView = styled.div`
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/images/background_home.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  justify-content: center;
  width: 100%;
  height: 100%;

  @media only screen and (max-width: ${screenWidths.tablet}) {
    width: 100%;
  }
  @media only screen and (max-width: ${screenWidths.phone}) {
    width: 100%;
    // height: 80vh;
  }
`;

const ProfileWrapper = styled.div`
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ProfessionTitle = styled.h2`
  color: white;
  font-size: 2.6rem;
  font-weight: 400;
  margin-bottom: 30px;
  line-height: 2.6rem;
  text-align: center;
`;

const ProfileName = styled.h3`
  color: white;
  font-weight: 400;
  font-size: ${fontsizes.title};
  text-align: center;
`;

const SocialMediaList = styled.div`
  margin-top: 50px;
`;

const SocialMediaWrapper = styled.a`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  cursor: pointer;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

const SocialMediaIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const SocialMediaView = ({ small }) => {
  if (small) {
    return (
      <Wrapper>
        <LeftView
          style={{ overflow: "visible", justifyContent: "flex-start" }}
        ></LeftView>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <LeftView>
        <ProfileWrapper>
          <ProfessionTitle>Full Stack Web Developer</ProfessionTitle>
          <ProfileName>David Forsberg Dimopoulos</ProfileName>
          <SocialMediaList>
            <Link href="https://twitter.com/bovver" passHref>
              <SocialMediaWrapper>
                <SocialMediaIcon src="/icons/twitter.svg" alt="twitter icon" />
              </SocialMediaWrapper>
            </Link>

            <Link
              href="https://www.linkedin.com/in/david-forsberg-dimopoulos"
              passHref
            >
              <SocialMediaWrapper style={{ marginLeft: 20 }}>
                <SocialMediaIcon
                  src="/icons/linkedin.svg"
                  alt="linkedin icon"
                />
              </SocialMediaWrapper>
            </Link>

            <Link href="https://github.com/DavidForsberg" passHref>
              <SocialMediaWrapper style={{ marginLeft: 20 }}>
                <SocialMediaIcon src="/icons/github.svg" alt="github icon" />
              </SocialMediaWrapper>
            </Link>
          </SocialMediaList>
        </ProfileWrapper>
      </LeftView>
    </Wrapper>
  );
};

export default SocialMediaView;
