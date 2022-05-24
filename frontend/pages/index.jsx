import styled from "styled-components";
import { fontsizes, screenWidths } from "../utils/globalStyles";
import React from "react";
import { NormalText, Title } from "../components/pageui";
import Icon from "../components/pageui/icon";
import PageHead from "../components/pageui/head";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  @media only screen and (max-width: ${screenWidths.tablet}) {
    flex-direction: column;
  }
  @media only screen and (max-width: ${screenWidths.phone}) {
    flex-direction: column;
    height: fit-content;
  }
`;

const RightView = styled.div`
  position: relative;
  flex-direction: column;
  width: 100%;
  overflow: hidden;

  @media only screen and (max-width: 1100px) {
    padding-top: 100px;
  }
  @media only screen and (max-width: ${screenWidths.tablet}) {
    width: 100%;
  }
  @media only screen and (max-width: ${screenWidths.phone}) {
    padding: 100px 0px;
  }
`;

const PageSection = styled.section`
  min-height: calc(90vh - 250px);
  max-height: calc(90vh - 250px);
  padding-top: 100px;
  padding-bottom: 100px;
  padding-left: 10%;
  padding-right: 10%;
  scroll-snap-align: start;
  @media only screen and (max-width: 1100px) {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const PageSectionHeader = styled.div`
  width: fit-content;
  padding-right: 60px;
  padding-bottom: 15px;
  border-bottom: 1px ${({ theme }) => theme.primaryColor} solid;
`;

export default function Home() {
  return (
    <Wrapper>
      <PageHead
        title="Full Stack Web Developer | Forsbergd"
        description="Web developer from Stockholm, Sweden."
      />
      <RightView>
        <PageSection>
          <PageSectionHeader>
            <Icon prefix="person" alt="about me icon" width="20" height="20" />
            <Title>About Me</Title>
          </PageSectionHeader>
          <NormalText style={{ marginTop: 50 }}>
            Developer from Stockholm, with focus on web and finance.
          </NormalText>
          <NormalText>
            When developing web-based projects I like to focus on SEO, UI/UX and
            creative design. Always keeping up with the state of the art
            technologies. ReactJS for frontend development, Node or .NET for
            backend, and Wordpress for fast publishes.
          </NormalText>
          <NormalText>
            The financial applications are usually trading bots, machine
            learning predictions and data gathering. These applications usually
            trade with stocks or options, sometimes other securities. The
            programs are often preliminary written in Python, then moved onto
            C/C++, C# or Java.
          </NormalText>
        </PageSection>
      </RightView>
    </Wrapper>
  );
}
