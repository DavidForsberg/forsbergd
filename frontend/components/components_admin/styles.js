import styled from "styled-components"

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding-top: 30px;
  color: ${({ theme }) => theme.primaryColor};
  overflow: hidden;
`;

export const EditorTitle = styled.h2`
  font-weight: 300;
  font-size: 2rem;
  padding-bottom: 19px;
  padding-left: 50px;
  border-bottom: ${({ theme }) => theme.lowOpacityBorder};
`;

export const EditorContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
`;

export const SimpleGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
  padding-left: 50px;
  padding-right: 50px;
`;

export const SimpleInput = styled.input`
  border: none;
  border-bottom: 1px ${({ theme }) => theme.primaryColor} solid;
  background: none;
  color: ${({ theme }) => theme.primaryColor};
  font-size: 1.2rem;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.primaryColor};
    opacity: 0.3;
  }
`;

export const SimpleLabel = styled.label`
  font-size: 1.2rem;
  padding-bottom: 0px;
  opacity: 0.5;
  user-select: none;
`;

export const SimpleButton = styled.button`
  background: none;
  border: none;
  padding: 20px 20px;
  cursor: pointer;

  &:hover {
    background: whitesmoke;
  }
`;

export const EditorActions = styled.div`
  display: flex;
  border-top: ${({theme }) => theme.lowOpacityBorder};
  padding: 30px 50px;
`;
