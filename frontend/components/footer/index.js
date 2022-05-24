import styled from "styled-components"
import { fontsizes, screenWidths } from "../../utils/globalStyles";

const Wrapper = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    height: 10%;
    align-items: center;
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);
    z-index: 10;
    background-color: ${({ theme }) => theme.secondBackground};
    transition: all 0.5s linear;
`;

const InnerWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 30%;
    height: 80%;
    margin-left: 100px;
    color: ${({ theme }) => theme.primaryColor };
    
    @media only screen and (max-width: ${screenWidths.laptop}) {
        width: 60%;
        margin-left: 50px;
    }
    @media only screen and (max-width: ${screenWidths.tablet}) {
        flex-direction: column;
        justify-content: space-evenly;
        align-items: flex-start;
        width: 70%;
        margin-left: 20px;
    }
    @media only screen and (max-width: ${screenWidths.phone}) {
        flex-direction: column;
        justify-content: space-evenly;
        align-items: flex-start;
        width: 70%;
        margin-left: 20px;
    }
`;

const ThemeToggleWrapper = styled.div`
    position: absolute;
    right: 50px;
    @media only screen and (max-width: ${screenWidths.phone}) {
        right: 10px;
    }
`;

const NameText = styled.h4`
    font-size: ${fontsizes.tiny};
    @media only screen and (max-width: ${screenWidths.phone}) {
        font-size: 10pt;
    }
`;

const EmailText = styled.h4`
    font-size: ${fontsizes.tiny};
    @media only screen and (max-width: ${screenWidths.phone}) {
        font-size: 10pt;
    }
`;

const Footer = ({ themeToggler }) => {
    return (
        <Wrapper>
            <InnerWrapper>
                <NameText>
                    David Forsberg Dimopoulos
                </NameText>
                <EmailText>
                    david.forsbergd@gmail.com
                </EmailText>
            </InnerWrapper>
            <ThemeToggleWrapper>
                {themeToggler}
            </ThemeToggleWrapper>
        </Wrapper>
    );
}
 
export default Footer;