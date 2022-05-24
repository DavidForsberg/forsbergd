import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { fontsizes } from "../../../utils/globalStyles";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  min-width: 100px;
  z-index: ${({ isOpen }) => (isOpen ? 10 : 1)};
`;

const SelectWrapper = styled.div`
  display: flex;
  position: relative;
  min-width: 100px;
  min-height: 30px;
`;

const SelectInnerWrapper = styled.div`
  display: flex;
  /* justify-content: center; */
  align-items: center;
  width: 100%;
  height: 30px;
  border-bottom: 1px grey solid;
`;

const OptionList = styled.ul`
  position: absolute;
  top: 30px;
  left: 0;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
`;

const OptionItem = styled.li`
  padding-top: 5px;
  padding-bottom: 5px;
  background: ${(props) =>
    props.isSelected ? props.theme.thirdBackground : props.theme.body};
`;

const OptionName = styled.label`
  font-size: ${fontsizes.small};
  margin-left: 5px;
  color: ${({ theme }) => theme.primaryColor};
`;

const Select = ({ placeholder, options, sendToParent, value }) => {
  const [selected, select] = useState(null);
  const [isOpen, toggle] = useState(false);

  const wrapperRef = useRef();

  // Toggle option list
  useEffect(() => {
    document.addEventListener("mousedown", (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        toggle(false);
      }
    });
  });

  useEffect(() => {
    console.log("values changed", value);
  }, [value]);

  const selectOption = (option) => {
    if (selected && selected.id === option.id) {
      select(null);
    } else {
      select(option);
    }
  };

  // On selected options change
  useEffect(() => {
    sendToParent(selected);
  }, [selected]);

  return (
    <Wrapper isOpen={isOpen}>
      <SelectWrapper ref={wrapperRef} onClick={() => toggle(true)}>
        <SelectInnerWrapper>
          {selected && (
            <label style={{ width: "100%" }}>{selected.title}</label>
          )}
        </SelectInnerWrapper>
        {isOpen && (
          <OptionList>
            {options.map((option) => {
              return (
                <OptionItem
                  key={option.id}
                  onClick={() => selectOption(option)}
                  isSelected={selected && selected.id === option.id}
                >
                  <OptionName>{option.title}</OptionName>
                </OptionItem>
              );
            })}
          </OptionList>
        )}
      </SelectWrapper>
    </Wrapper>
  );
};

export default Select;
