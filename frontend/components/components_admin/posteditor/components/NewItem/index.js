import styled from "styled-components"

const Wrapper = styled.div`
  display: flex;
  position: relative;
  /* justify-content: space-between; */
  align-items: center;
  width: 100%;
  height: 40px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
      background: whitesmoke;
  }
  /* min-height: 100px; */
`;


const NewItem = ({ onAdd }) => {
    return (
        <Wrapper>
            <img src="/icons/plus.svg" alt="add icon" onClick={() => onAdd(1)} style={{ marginLeft: 10 }} />
            <img src="/icons/image.svg" alt="upload image icon" onClick={() => onAdd(2)} style={{ marginLeft: 10 }} />
        </Wrapper>
    );
}
 
export default NewItem;