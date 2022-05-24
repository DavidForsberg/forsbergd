import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  margin-top: 20px;
  &:hover {
    background: whitesmoke;
  }
`;

const ImagePreview = styled.img`
  height: 40px;
  width: 40px;
`;

const FileUpload = styled.label``;

// Options Menu //
const OptionButton = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 10%;
  cursor: pointer;
`;

const OptionsMenu = styled.div`
  position: absolute;
  bottom: -325px;
  width: 200px;
  height: 300px;
  z-index: 999;
  background: white;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
`;

const ImageField = () => {
  const [image, setImage] = useState(null);
  const [optionsOpen, toggleOptions] = useState(false);

  const fileInput = useRef(null);

  const onChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let tempImg = URL.createObjectURL(e.target.files[0]);
      setImage(tempImg);
    }
  };

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
  });

  return (
    <Wrapper>
      <input
        type="file"
        name="image"
        ref={fileInput}
        onChange={onChange}
        style={{ display: "none" }}
      />
      <button className="upload-btn" onClick={() => fileInput.current.click()}>
        Choose File
      </button>
      <ImagePreview src={image} alt="Upload file image" />
      <OptionButton onClick={() => toggleOptions(true)} ref={optionsMenuRef}>
        <img
          src="/icons/more-horizontal.svg"
          alt="options icon"
          onClick={() => toggleOptions(false)}
        />
        {optionsOpen && <OptionsMenu></OptionsMenu>}
      </OptionButton>
    </Wrapper>
  );
};

export default ImageField;
