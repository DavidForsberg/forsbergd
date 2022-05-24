import styled from "styled-components";
import { fontsizes, screenWidths } from "../../utils/globalStyles";

export const TitleLine = styled.span`
  width: 30%;
  min-height: 1px;
  max-height: 1px;
  background: ${({ theme }) => theme.primaryColor};
  margin-top: 15px;
  margin-bottom: 15px;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
  color: ${({ theme }) => theme.primaryColor};
  margin-left: 20px;
`;

export const NormalText = styled.p`
  width: 80%;
  color: ${({ theme }) => theme.primaryColor};
  font-size: ${fontsizes.regular};
  margin-top: 20px;
  line-height: 160%;
  @media only screen and (max-width: ${screenWidths.laptop}) {
    font-size: ${fontsizes.tiny};
  }
`;
