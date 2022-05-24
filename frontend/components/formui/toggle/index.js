import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100%;
    user-select: none;
`;

const SunIcon = styled.img`
    color: white;
    transition: all 0.5s linear;
    width: 30px;
    height: 30px;
`;

const MoonIcon = styled.img`
    color: black;
    transition: all 0.5s linear;
    width: 30px;
    height: 30px;
`;


export const Toggle = ({ theme, toggleTheme }) => {
    return (
        <Wrapper onClick={toggleTheme}>
            {theme === "light" ? <MoonIcon src="/icons/moon.svg" alt="dark mode" /> : <SunIcon src="/icons/sun_white.svg" alt="light mode" />}
        </Wrapper>
    )
}