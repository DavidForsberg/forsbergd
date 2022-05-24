import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 10%;
`;

const Title = styled.h2``;

const ButtonGroup = styled.div``;

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const AddSelect = ({ selectedOption, clickHandler, options }) => {
  return (
    // <Select
    //   value={selectedOption}
    //   onChange={this.handleChange}
    //   options={options}
    // />
    <button onClick={() => clickHandler()}></button>
  );
};

// ---

const Header = ({ post_title, addHandler }) => {
  const [selectedOption, setOption] = useState(null);
  const [inputActivated, toggleTitle] = useState(false);
  const [title, setTitle] = useState("New post");

  const titleRef = useRef();
  useEffect(() => {
    if (inputActivated) {
      document.addEventListener("mousedown", (event) => {
        if (titleRef.current && !titleRef.current.contains(event.target)) {
          toggleTitle(inputActivated);
        }
      });
    }
  });

  const titleEnterPress = (e) => {
    if (e.key === "Enter") {
      toggleTitle();
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <Wrapper>
      {inputActivated ? (
        <input
          style={{ height: "auto", fontSize: "1.3rem" }}
          onChange={(e) => handleTitleChange(e)}
          onKeyPress={(e) => titleEnterPress(e)}
          ref={titleRef}
        />
      ) : (
        <Title onDoubleClick={() => toggleTitle(!inputActivated)}>
          {title}
        </Title>
      )}

      <ButtonGroup></ButtonGroup>
    </Wrapper>
  );
};

export default Header;
