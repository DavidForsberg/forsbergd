import axios from "axios";
import styled from "styled-components";
import { fontsizes, screenWidths } from "../../utils/globalStyles";
import { baseUrl } from "../../utils/globalSettings";
import { useTheme } from "styled-components";
import Head from "next/head";
import Image from "next/image";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  height: 100%;
  padding-top: 150px;
  h1 {
    font-size: 3rem;
    color: ${({ theme }) => theme.primaryColor};
  }
  @media only screen and (max-width: ${screenWidths.laptop}) {
    width: 50%;
  }
  @media only screen and (max-width: ${screenWidths.tablet}) {
    width: 80%;
  }
`;

const PostHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 30px;
  @media only screen and (max-width: ${screenWidths.phone}) {
    flex-direction: column;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  color: ${({ theme }) => theme.primaryColor};

  h2 {
    line-height: 1.5em;
  }

  @media only screen and (max-width: ${screenWidths.phone}) {
    width: 100%;

    h1 {
      font-size: ${fontsizes.title};
    }
    h2 {
      font-size: ${fontsizes.small};
      line-height: 130%;
    }
    h3 {
      font-size: ${fontsizes.tiny};
    }
  }
`;

const AdditionalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  border-top: ${({ theme }) => theme.lowOpacityBorder};
  margin-top: 100px;
  padding-top: 50px;
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 30px;
  padding-bottom: 30px;
`;

const SelfTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.primaryColor} !important;

  p,
  li {
    line-height: 175%;
  }
  p,
  h1,
  h2,
  h3,
  h4 {
    width: 100%;
  }
  p {
    font-size: 1.3rem;
  }
  h3,
  h4 {
    font-size: 2rem;
    line-height: 1.7rem;
    padding-bottom: 30px;
  }

  span,
  a {
    color: ${({ theme }) => theme.primaryColor} !important;
  }

  a {
  }

  @media only screen and (max-width: ${screenWidths.phone}) {
    p {
      font-size: ${fontsizes.small};
      line-height: 140%;
    }
    h3 {
      font-size: ${fontsizes.small};
    }
  }
`;

const ContentFooter = styled.div`
  display: flex;
  width: 100%;
  min-height: 200px;
  max-height: 200px;
`;

const FileDownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  outline: none;
  background: none;
  cursor: pointer;
  border: none;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
  font-weight: 600;
  padding: 30px 0px;
  width: 100%;
  color: ${({ theme }) => theme.primaryColor};

  &:hover {
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
  }
`;

const TagText = styled.label`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.primaryColor};

  @media only screen and (max-width: 450px) {
    font-size: 1rem;
  }
`;

const TagSpan = styled.span`
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 7px;
  padding-bottom: 7px;
  background-color: ${({ theme }) => theme.thirdBackground};
  margin-right: 30px;
  margin-top: 10px;

  @media only screen and (max-width: 450px) {
    margin-right: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
`;

const BottomInfo = styled.div`
  display: flex;
  align-items: flex-end;
  height: 35%;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.primaryColor};
`;

const BottomDate = styled.div`
  display: flex;
`;

const BottomDateText = styled.p`
  font-size: 12pt;
  font-weight: 400;
  margin-left: 10px;
  color: ${({ theme }) => theme.primaryColor};
`;

const BottomTime = styled.div`
  display: flex;
  margin-left: 50px;
  @media only screen and (max-width: 500px) {
    margin-left: 50px;
  }
`;

const BottomTimeText = styled.p`
  font-size: 12pt;
  font-weight: 400;
  margin-left: 10px;
`;

const Post = ({ postData }) => {
  console.log(postData);
  console.log(
    `${baseUrl}/${postData.post.server_filepath}/${postData.post.thumbnail}`
  );
  const theme = useTheme();
  const iconColor = theme.primaryIconColor;

  const formattedDate = new Date(postData.post.created);
  const dateStr =
    formattedDate.toLocaleString("en-us", { month: "short" }) +
    " " +
    formattedDate.getDate() +
    ", " +
    formattedDate.getFullYear();

  const getZipFile = () => {
    axios({
      url: `${baseUrl}/download`,
      method: "post",
      responseType: "blob",
      data: {
        folder: postData.post.server_filepath,
        filename: postData.post.filename,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", postData.post.filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {
        alert("Error downloading the file");
      });
  };

  const page_title = postData.post.title + " | Forsbergd";
  const page_desc = postData.post.description;
  return (
    <Wrapper>
      <Head>
        <title>{page_title}</title>
        <meta name="description" content={page_desc} />
      </Head>
      <ContentWrapper>
        <PostHeaderWrapper>
          <TitleWrapper>
            <h1 style={{ fontWeight: "bolder", marginBottom: 15 }}>
              {postData.post.title}
            </h1>

            <h2 style={{ fontWeight: "500", marginTop: 10, opacity: 0.8 }}>
              {postData.post.description}
            </h2>
            <DetailWrapper>
              {postData.tags.length > 0 &&
                postData.tags.map((tag, i) => {
                  return (
                    <TagSpan key={i}>
                      <TagText>{tag}</TagText>
                    </TagSpan>
                  );
                })}
            </DetailWrapper>
          </TitleWrapper>
        </PostHeaderWrapper>
        <BottomInfo>
          <BottomDate>
            <Image
              src={`/icons/calendar_${iconColor}.svg`}
              width="20"
              height="20"
              alt="date icon"
              priority
            />
            <BottomDateText>{dateStr}</BottomDateText>
          </BottomDate>
          <BottomTime>
            <Image
              src={`/icons/time_${iconColor}.svg`}
              width="20"
              height="20"
              alt="time icon"
              priority
            />
            <BottomTimeText>{postData.post.read_time}</BottomTimeText>
          </BottomTime>
        </BottomInfo>
        {postData.post.thumbnail && postData.post.thumbnail.length > 0 && (
          <img
            src={`${baseUrl}/${postData.post.server_filepath}/${postData.post.thumbnail}`}
            style={{ marginBottom: 150 }}
            alt="Post thumbnail"
          />
        )}

        <SelfTextWrapper
          dangerouslySetInnerHTML={{
            __html: postData.post.full_html,
          }}
          style={{ width: "100%" }}
        ></SelfTextWrapper>
        <AdditionalWrapper>
          {postData.post.filename && postData.post.filename.length > 0 && (
            <FileDownloadButton onClick={() => getZipFile()}>
              <label>{`${postData.post.filename}`}</label>
              <img
                src={`/icons/download_${iconColor}.svg`}
                style={{ marginLeft: 10, color: "white" }}
                alt="download file icon"
              />
            </FileDownloadButton>
          )}
        </AdditionalWrapper>
        <ContentFooter></ContentFooter>
      </ContentWrapper>
    </Wrapper>
  );
};

export const getStaticPaths = async () => {
  const res = await fetch(`${baseUrl}/posts-minimal`);
  const data = await res.json();

  const paths = data.posts.map((post) => {
    return {
      params: { slug: post.slug.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const slug = context.params.slug;
  const res = await fetch(`${baseUrl}/posts/` + slug);
  const data = await res.json();

  return {
    props: { postData: data },
  };
};

export default Post;
