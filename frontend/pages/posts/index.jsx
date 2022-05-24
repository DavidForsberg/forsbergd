import styled from "styled-components";
import { baseUrl } from "../../utils/globalSettings";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useTheme } from "styled-components";
import Image from "next/image";
import { NormalText, Title, TitleLine } from "../../components/pageui";
import PageHead from "../../components/pageui/head";
import Icon from "../../components/pageui/icon";
import { motion } from "framer-motion";

const Wrapper = styled.div`
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TopWrapper = styled.div`
  flex-direction: column;
  padding-top: 100px;
  padding-left: 10%;
  padding-right: 10%;
  padding-bottom: 100px;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// Dynamically import posts to improve first load speed
const PostItem = dynamic(() => import("../../components/postitem"), {
  ssr: false,
});

const Posts = ({ postData }) => {
  console.log(postData);
  const posts = postData.posts;

  return (
    <Wrapper>
      <PageHead
        title="Developer Blog | Forsbergd"
        description="Original blog posts related to coding and finance."
      />
      <TopWrapper>
        <div>
          <Icon prefix="blog" alt="blog icon" width="20" height="20" />
          <Title>Developer Blog</Title>
        </div>
        <TitleLine />
        <NormalText>
          Original blog posts related to coding and finance.
        </NormalText>
      </TopWrapper>
      <InnerWrapper>
        {posts &&
          posts.map((post) => {
            return (
              <PostItem
                title={post.title}
                desc={post.description}
                created_date={post.created.substr(0, 10)}
                slug={post.slug}
                key={post.id}
                thumbnail={post.thumbnail}
                readTime={post.read_time}
              />
            );
          })}
      </InnerWrapper>
    </Wrapper>
  );
};

export async function getStaticProps() {
  const res = await fetch(`${baseUrl}/posts-minimal`);
  const data = await res.json();

  return {
    props: { postData: data },
  };
}

export default Posts;
