import { useState } from "react";
import styled from "styled-components";
import { screenWidths } from "../../utils/globalStyles";

const Wrapper = styled.div`
  /* height: ${(props) => (props.isOpen ? "auto" : "70%")}; */
  height: 70%;
  box-shadow: ${(props) => props.isOpen && "0px 0px 5px 0px rgba(0,0,0,0.75)"};
  border-bottom: none;
  width: 40%;
  z-index: 999;
  position: relative;
  @media only screen and (max-width: ${screenWidths.laptop}) {
    width: 50%;
  }
  @media only screen and (max-width: ${screenWidths.tablet}) {
    width: 80%;
  }
  @media only screen and (max-width: ${screenWidths.phone}) {
    width: 90%;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border: 1px lightgray solid;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
  height: 100%;
`;

const TextWrapper = styled.div`
  display: flex;
  width: 90%;
  height: 100%;
`;

const TextInput = styled.input`
  width: 98%;
  border: none;
  outline: none;
  font-size: 1.5rem;
`;

// Dropdown items
const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  background: white;
  cursor: pointer;
  &:hover {
    background: whitesmoke;
  }
`;

const ItemTitle = styled.h3`
  margin-left: 15px;
`;

const ItemDate = styled.h4`
  margin-right: 15px;
`;

const content = [
  {
    id: 1,
    title: "Investor evaluation",
    tags: ["finance", "python", "sql", "mysql", "high-frequency"],
  },
  {
    id: 2,
    title: "How this website is structured",
    tags: ["html", "web", "css", "react", "nextjs", "design"],
  },
  {
    id: 3,
    title: "Kinnevik evaluation",
    tags: ["finance", "python", "sql", "mysql", "high-frequency"],
  },
  {
    id: 4,
    title: "Bure evaluation",
    tags: ["finance", "python", "sql", "mysql", "high-frequency"],
  },
  {
    id: 5,
    title: "Ica group evaluation",
    tags: ["finance", "python", "sql", "mysql", "high-frequency"],
  },
  {
    id: 6,
    title: "Cloudflare evaluation",
    tags: ["finance", "python", "sql", "mysql", "high-frequency"],
  },
  {
    id: 7,
    title: "Coca-cola evaluation",
    tags: ["finance", "python", "sql", "mysql", "high-frequency"],
  },
];

const Search = () => {
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleChange = (event) => {
    var searchedText = event.target.value.toLocaleLowerCase();
    var filteredPosts = content.filter((post) => {
      // return (post.title.indexOf(searchedText) !== -1)
      return (
        post.title.toLocaleLowerCase().includes(searchedText) |
        (post.tags.indexOf(searchedText) !== -1)
      );
    });
    if (event.target.value === "") setFilteredPosts([]);
    else
      setFilteredPosts(
        filteredPosts.sort((a, b) => a.title.localeCompare(b.title))
      );
  };

  return (
    <Wrapper isOpen={filteredPosts.length > 0}>
      <InputWrapper>
        <IconWrapper>
          <img src="/icons/search.svg" alt="search icon" />
        </IconWrapper>
        <TextWrapper>
          <TextInput onChange={(event) => handleChange(event)} />
        </TextWrapper>
      </InputWrapper>
      {filteredPosts.map((x) => {
        return (
          <ItemWrapper>
            <ItemTitle>{x.title}</ItemTitle>
            <ItemDate>2021-04-10</ItemDate>
          </ItemWrapper>
        );
      })}
    </Wrapper>
  );
};

export default Search;
