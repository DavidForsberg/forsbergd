import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { fontsizes } from "../../utils/globalStyles";

const TempDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 0 50px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: 1px black solid;
  overflow-y: scroll;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px black solid;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;

  h4 {
    font-size: ${fontsizes.title};
    outline: none;
    padding-bottom: 20px;
  }

  p {
    font-size: ${fontsizes.regular};
    outline: none;
  }

  a {
    font-size: ${fontsizes.regular};

    outline: none;
  }
`;

const Button = styled.button`
  padding: 20px 20px;
  background: none;
  border: none;
  border-right: 1px black solid;
  cursor: pointer;
`;

const Editor = ({ value, onChange }) => {
  const contentRef = useRef();

  useEffect(() => {
    handleLoad();
    // document.addEventListener("contextmenu", openMenu);
    // if (value )
  }, [value]);

  const surroundSelection = (element) => {
    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel.rangeCount) {
        var range = sel.getRangeAt(0).cloneRange();
        range.surroundContents(element);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  const handleKeyPress = (e, id) => {
    if (e.key === "Enter") {
      //   e.preventDefault();
    }

    if (e.key === "Backspace") {
      if (e.srcElement.innerHTML.length === 0) e.srcElement.remove();
    }
  };

  const addElement = (type) => {
    let newElement = document.createElement(type);

    newElement.onkeydown = handleKeyPress;
    newElement.contentEditable = "true";

    if (type === "a") {
      newElement.contentEditable = "false";
      newElement.href = prompt("Link to where? (href)");
      surroundSelection(newElement);
      return;
    }

    if (type === "b") {
      newElement.contentEditable = "false";
      surroundSelection(newElement);
      return;
    }

    if (type === "i") {
      newElement.contentEditable = "false";
      surroundSelection(newElement);
      return;
    }

    newElement.innerText = "element";
    contentRef.current.appendChild(newElement);
  };

  const handleSubmit = () => {
    // Edit HTML before save
    for (let i = 0; i < contentRef.current.children.length; i++) {
      contentRef.current.children[i].contentEditable = "false";
    }

    onChange(contentRef.current.innerHTML);
  };

  const handleLoad = () => {
    contentRef.current.innerHTML = value;

    for (let i = 0; i < contentRef.current.children.length; i++) {
      contentRef.current.children[i].contentEditable = "true";
    }
  };

  return (
    <TempDiv>
      <Wrapper contenteditable={true}>
        {/* Header */}
        <Header>
          <Button onClick={() => addElement("h4")}>H4</Button>
          <Button onClick={() => addElement("p")}>P</Button>
          <Button onClick={() => addElement("a")}>A</Button>
          <Button onClick={() => addElement("b")}>B</Button>
          <Button onClick={() => addElement("i")}>I</Button>
        </Header>

        {/* Textarea */}
        <Content contenteditable="true" ref={contentRef}></Content>
      </Wrapper>
      <button onClick={handleSubmit}>Save</button>
      <button onClick={handleLoad}>load</button>
    </TempDiv>
  );
};

export default Editor;
