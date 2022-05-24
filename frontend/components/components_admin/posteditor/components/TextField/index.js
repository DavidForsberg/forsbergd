import styled from "styled-components";
import TextareaAutosize from "react-textarea-autosize";
import { useEffect, useRef, useState } from "react";
import { fontsizes } from "../../../../../utils/globalStyles";

const Wrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  width: auto;
  &:hover {
    background: whitesmoke;
  }
  font-size: ${fontsizes.small};
  border-bottom: ${({ theme, active }) => active ? "1px black solid" : theme.lowOpacityBorder};
  min-height: 1.5rem;
`;

// Options Menu //
const OptionButton = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
`;

const OptionsMenuWrapper = styled.div`
  position: absolute;
  bottom: -300px;
  width: 200px;
  height: 300px;
  z-index: 9;
  background: white;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
`;

const OperationsMenu = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// //

const TextField = ({ onAdd, group, onTextChange, defaultValue }) => {
  const [selectedOption, setOption] = useState(null);
  const [optionsOpen, toggleOptions] = useState(false);
  const [isActive, setActive] = useState(true);
  const [text, setText] = useState("");

  const wrapperRef = useRef()

  // Options Menu
  const optionsMenuRef = useRef();

  useEffect(() => {
    if (optionsOpen) {
      // Close options menu if its open
      document.addEventListener("mousedown", (event) => {
        if (
          optionsMenuRef.current &&
          !optionsMenuRef.current.contains(event.target)
        ) {
          toggleOptions(!optionsOpen);
        }
      });
    }
    document.addEventListener("mousedown", (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setActive(false);
      }
    });
  });

  useEffect(() => {
    if (defaultValue) setText(defaultValue)
  })
  // const textEnterPress = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     onAdd(1);
  //   }
  // };

  return (
    <Wrapper ref={wrapperRef} active={isActive}>
      {isActive ? 
        <TextareaAutosize
          style={{
            resize: "none",
            fontSize: "1.2rem",
            lineHeight: "1.5rem",
            width: "90%",
            border: "none",
            background: "transparent",
            outline: 0,
            marginLeft: 0,
          }}
          defaultValue={text}
          onChange={(event) => {
            setText(event.target.value)
            onTextChange(group, event.target.value);
          }}
          // onKeyPress={textEnterPress}
        /> :
        <div onDoubleClick={() => setActive(true)} style={{ width: "100%" }}>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.5rem" }}>{text}</p>
        </div>
      }
      {/* <OptionButton onClick={() => toggleOptions(true)} ref={optionsMenuRef}>
        <img src="/icons/more-horizontal.svg" onClick={() => toggleOptions(false)} />
        {optionsOpen && (
          <OptionsMenuWrapper>
            <OperationsMenu></OperationsMenu>
          </OptionsMenuWrapper>
        )}
      </OptionButton> */}
    </Wrapper>
  );
};

export default TextField;
