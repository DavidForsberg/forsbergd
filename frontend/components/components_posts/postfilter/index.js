import styled from "styled-components"
import MultiSelect from "../../formui/multiselect";

const FilterPosts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  height: 100%;
`;

const FilterPostsInner = styled.div`
  color: ${({ theme }) => theme.body};
  width: 90%;
  height: 100%;
`;

const PostFilter = ({ tags, getSelectedTags }) => {
    return (
        <FilterPosts>
            <FilterPostsInner>
                <MultiSelect options={tags} placeholder="Select tags.." sendToParent={getSelectedTags} />
            </FilterPostsInner>
        </FilterPosts>
    );
}
 
export default PostFilter;