import styled from "styled-components";
import { fontsizes } from "../../utils/globalStyles";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-top: ${({ theme }) => theme.lowOpacityBorder};
  height: 220px;
  min-height: 220px;
  padding: 30px 10%;
  box-sizing: border-box;
  color: ${({ theme }) => theme.primaryColor};
  @media only screen and (max-width: 400px) {
    padding: 30px 20px;
  }
`;

const Title = styled.h3`
  font-weight: 400;
  font-size: ${fontsizes.regular};
  height: 25%;
`;

const Desc = styled.div`
  height: 45%;
  width: 80%;
  @media only screen and (max-width: 1100px) {
    width: 100%;
  }
`;

const DescText = styled.p`
  font-weight: 400;
  opacity: 0.7;
  font-size: ${fontsizes.regular};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  overflow: hidden;
  -webkit-box-orient: vertical;
`;

const BottomInfo = styled.div`
  display: flex;
  align-items: flex-end;
  height: 35%;
`;

const BottomDate = styled.div`
  display: flex;
`;

const BottomDateText = styled.p`
  font-size: 12pt;
  font-weight: 400;
  margin-left: 10px;
`;

const BottomTime = styled.div`
  display: flex;
  margin-left: 150px;
  @media only screen and (max-width: 500px) {
    margin-left: 50px;
  }
`;

const BottomTimeText = styled.p`
  font-size: 12pt;
  font-weight: 400;
  margin-left: 10px;
`;

const PostItem = ({ title, desc, created_date, slug, readTime }) => {
  const theme = useTheme();
  const iconColor = theme.primaryIconColor;

  const formattedDate = new Date(created_date);
  const dateStr =
    formattedDate.toLocaleString("en-us", { month: "short" }) +
    " " +
    formattedDate.getDate() +
    ", " +
    formattedDate.getFullYear();

  return (
    <Link href={`/posts/${slug}`} key={1}>
      <a style={{ textDecoration: "none" }}>
        <Wrapper>
          <Title>{title}</Title>
          <Desc>
            <DescText>{desc}</DescText>
          </Desc>
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
              <BottomTimeText>{readTime}</BottomTimeText>
            </BottomTime>
          </BottomInfo>
        </Wrapper>
      </a>
    </Link>
  );
};

export default PostItem;
