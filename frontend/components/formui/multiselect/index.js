import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { fontsizes } from "../../../utils/globalStyles";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  min-width: 100px;
`;

const SelectWrapper = styled.div`
  display: flex;
  position: relative;
  min-width: 100px;
  min-height: 30px;
`;

const SelectInnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 30px;
  border-bottom: 1px grey solid;
`;

const InputSearch = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: ${fontsizes.small};
  background-color: ${({ theme }) => theme.body};
  transition: all 0.5s linear;
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

const SelectedWrapper = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 100%;
  margin-top: 50px;
  flex-wrap: wrap;
`;

const SelectedOption = styled.div`
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
  margin-right: 15px;
  margin-top: 15px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  background: ${({ theme }) => theme.thirdBackground};
`;

const SelectedOptionText = styled.label`
  color: ${({ theme }) => theme.primaryColor};
`;

const MultiSelect = ({ placeholder, options, sendToParent }) => {
  const [selected, select] = useState([]);
  const [isOpen, toggle] = useState(false);
  const [searchedOption, setSearchValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  const wrapperRef = useRef();

  // Toggle option list
  useEffect(() => {
    document.addEventListener("mousedown", (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        toggle(false);
      }
    });
  });

  const selectOption = (option) => {
    const tempArr = [...selected];
    if (tempArr.some((existingOption) => existingOption.id === option.id)) {
      var foundIndex = tempArr.indexOf(option);
      if (foundIndex !== -1) tempArr.splice(foundIndex, 1);
    } else {
      tempArr.push(option);
    }

    select(tempArr);
  };

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
    if (event.target.value === "") setFilteredOptions([]);
    const tempArr = [...options];
    const filteredOptions = tempArr.filter((option) => {
      return option.title.toLocaleLowerCase().includes(event.target.value);
    });
    setFilteredOptions(filteredOptions);
  };

  // On selected options change
  useEffect(() => {
    sendToParent(selected);
  }, [selected]);

  return (
    <Wrapper>
      <SelectWrapper ref={wrapperRef} onClick={() => toggle(true)}>
        <SelectInnerWrapper>
          <InputSearch placeholder={placeholder} onChange={handleSearch} />
        </SelectInnerWrapper>
        {isOpen && (
          <OptionList>
            {filteredOptions.length > 0 &&
              filteredOptions.map((option) => {
                return (
                  <OptionItem
                    key={option.id}
                    onClick={() => selectOption(option)}
                    isSelected={selected.includes(option)}
                  >
                    <OptionName>{option.title}</OptionName>
                  </OptionItem>
                );
              })}
            {filteredOptions.length === 0 &&
              options.map((option) => {
                return (
                  <OptionItem
                    key={option.id}
                    onClick={() => selectOption(option)}
                    isSelected={selected.includes(option)}
                  >
                    <OptionName>{option.title}</OptionName>
                  </OptionItem>
                );
              })}
          </OptionList>
        )}
      </SelectWrapper>
      <SelectedWrapper>
        {selected.map((option) => {
          return (
            <SelectedOption key={option.id}>
              <SelectedOptionText>{option.title}</SelectedOptionText>
            </SelectedOption>
          );
        })}
      </SelectedWrapper>
    </Wrapper>
  );
};

export default MultiSelect;
