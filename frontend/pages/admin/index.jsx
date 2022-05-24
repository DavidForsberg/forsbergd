import styled from "styled-components";
import PostEditor from "../../components/components_admin/posteditor";
import ProjectEditor from "../../components/components_admin/projecteditor";
import React, { useEffect, useState } from "react";
import getConfig from "next/config";
import axios from "axios";
import { baseUrl } from "../../utils/globalSettings";
const { publicRuntimeConfig } = getConfig();
import Head from "next/head";
import { useTheme } from "styled-components";
import {
  SimpleGroup,
  SimpleInput,
  SimpleLabel,
} from "../../components/components_admin/styles";
import TextField from "../../components/components_admin/posteditor/components/TextField";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: space-between;
  justify-content: space-between;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  height: 100%;
  border-right: ${({ theme }) => theme.lowOpacityBorder};
  justify-content: space-between;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-bottom: ${({ theme }) => theme.lowOpacityBorder};
  padding: 10px 20px;
  background: none;
  outline: none;
  cursor: pointer;
  background: ${({ active }) => active && "whitesmoke"};

  &:hover {
    background: whitesmoke;
  }
`;

const MenuItemText = styled.h2`
  font-size: 1.2rem;
  font-weight: 300;
  color: ${({ theme }) => theme.primaryColor};
`;

const SignOutButton = styled.button`
  padding: 50px 50px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  &:hover {
    background-color: whitesmoke;
  }
`;

const Admin = () => {
  const [activeView, setView] = useState("post");
  const theme = useTheme();
  const iconColor = theme.primaryIconColor;
  const [isLoggedIn, logInState] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const logIn = () => {
    const data = { username, password, code: "kladdkakamedvanilj" };

    axios({
      method: "post",
      url: `${baseUrl}/login`,
      headers: {},
      data,
    })
      .then((res) => {
        if (res.data.accessToken) {
          localStorage.setItem("adminJwt", res.data.accessToken);
          logInState(true);
        } else {
          alert(res.data.message);
        }
      })
      .catch(() => {
        alert("Something went wrong");
        return false;
      });
  };

  useEffect(() => {
    if (localStorage.getItem("adminJwt")) {
      logInState(true);
    }
  }, []);

  return (
    <Wrapper>
      <Head>
        <title>Admin | Forsbergd</title>
        <meta name="robots" content="noindex,follow"></meta>
        <meta name="googlebot" content="noindex,follow"></meta>
      </Head>

      {!isLoggedIn && (
        <div style={{ flexDirection: "column" }}>
          <SimpleGroup>
            <SimpleLabel>Username</SimpleLabel>
            <SimpleInput onChange={(e) => setUsername(e.target.value)} />
          </SimpleGroup>
          <SimpleGroup>
            <SimpleLabel>Password</SimpleLabel>
            <SimpleInput
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </SimpleGroup>
          <button onClick={() => logIn()}>Log in</button>
          <button onClick={() => register()}>Register</button>
        </div>
      )}

      {isLoggedIn && (
        <InnerWrapper>
          <Menu>
            <MenuList>
              <MenuItem
                onClick={() => setView("post")}
                active={activeView === "post"}
              >
                <MenuItemText>Post</MenuItemText>
              </MenuItem>
              <MenuItem
                onClick={() => setView("project")}
                active={activeView === "project"}
              >
                <MenuItemText>Project</MenuItemText>
              </MenuItem>
            </MenuList>

            <SignOutButton
              onClick={() => {
                localStorage.removeItem("adminJwt");
                logInState(false);
              }}
              style={{ marginTop: 50 }}
            >
              <img
                src={`/icons/sign-out_${iconColor}.svg`}
                alt="sign out icon"
                style={{ width: 50, height: 50 }}
              />
            </SignOutButton>
          </Menu>
          {activeView === "post" && <PostEditor />}
          {activeView === "project" && <ProjectEditor />}
        </InnerWrapper>
      )}
    </Wrapper>
  );
};

export default Admin;
