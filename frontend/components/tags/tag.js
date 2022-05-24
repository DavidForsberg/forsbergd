import styled from "styled-components"

const Wrapper = styled.div`
    padding: 10px;
    border: 1px black solid;
`;

const TagText = styled.label`

`;

const Tag = () => {
    return (
        <Wrapper>
            <TagText>Finance</TagText>
        </Wrapper>
    );
}
 
export default Tag;