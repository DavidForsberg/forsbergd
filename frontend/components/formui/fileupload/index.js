import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  flex-direction: column;
  align-items: flex-start;
  padding-top: 10px;
`;

const Button = styled.button`
  background: none;
  outline: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const FileUpload = ({ handleFile, multiple, children }) => {
  const [file, setFile] = useState(null);
  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const uploadedFiles = event.target.files;
    if (multiple) {
      setFile(uploadedFiles);
      handleFile(uploadedFiles);
    } else {
      setFile(uploadedFiles[0]);
      handleFile(uploadedFiles[0]);
    }
  };

  return (
    <Wrapper>
      <Button onClick={handleClick}>
        <img
          src="/icons/file-upload_black.svg"
          alt="upload file icon"
          width="32"
          height="40"
        />
      </Button>
      {file && !multiple && (
        <label style={{ marginLeft: 10 }}>{file.name}</label>
      )}
      {file && file.length > 0 && multiple && <>{children}</>}
      <input
        type="file"
        style={{ display: "none" }}
        ref={hiddenFileInput}
        onChange={handleChange}
        multiple={multiple}
      />
    </Wrapper>
  );
};

export default FileUpload;
