import { useEffect, useState } from "react";
import styled from "styled-components";
import { fontsizes } from "../../../utils/globalStyles";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 500px;
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
  font-size: ${fontsizes.tiny};
  outline: 0;
  border: 0;
  border-bottom: 1px black solid;
`;

const SavedInputWrapper = styled.div`
  display: flex;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const SavedInput = styled.div`
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
  margin-right: 15px;
  margin-top: 15px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
`;

const SaveInputText = styled.label`
  cursor: pointer;
`;

const MultiInput = ({ placeholder, sendToParent, defaultSelected }) => {
  const [savedInputs, setSavedInputs] = useState([]);

  // Add saved input
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const tempArr = [...savedInputs];
      tempArr.push(event.target.value.toLowerCase());
      setSavedInputs(tempArr);
      event.target.value = "";
    }
  };

  // Delete saved input
  const handleDelete = (savedInput) => {
    const tempArr = [...savedInputs];
    var foundIndex = tempArr.indexOf(savedInput);
    if (foundIndex !== -1) tempArr.splice(foundIndex, 1);
    setSavedInputs(tempArr);
  };

  // When saved inputs changes
  useEffect(() => {
    sendToParent(savedInputs);
  }, [savedInputs]);

  // If default selected options are passed
  useEffect(() => {
    if (defaultSelected && defaultSelected.length > 0)
      setSavedInputs(defaultSelected);
  }, [defaultSelected]);

  return (
    <Wrapper>
      <Input onKeyDown={handleKeyPress} placeholder={placeholder} />
      <SavedInputWrapper>
        {savedInputs.map((savedInput, i) => {
          return (
            <SavedInput key={i} onClick={() => handleDelete(savedInput)}>
              <SaveInputText>{savedInput}</SaveInputText>
            </SavedInput>
          );
        })}
      </SavedInputWrapper>
    </Wrapper>
  );
};

export default MultiInput;
