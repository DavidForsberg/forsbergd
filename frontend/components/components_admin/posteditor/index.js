import React, { useState } from "react";
import axios from "axios";
import TextField from "./components/TextField";
import FileUpload from "../../formui/fileupload";
import MultiInput from "../../formui/multiinput";
import { baseUrl } from "../../../utils/globalSettings";
import {
  Wrapper,
  EditorActions,
  EditorTitle,
  EditorContent,
  SimpleGroup,
  SimpleLabel,
  SimpleInput,
  SimpleButton,
} from "../styles";
import Editor from "../../editor";

const PostEditor = () => {
  const [post, setPost] = useState({
    full_html: "",
    title: "",
    description: "",
    tags: [],
    id: -1,
    slug: "",
    date: new Date().toISOString().substring(0, 10),
    file: null,
    thumbnail: "",
    serverFilepath: "",
    read_time: "",
  });

  const [postImage, setPostImg] = useState(null);
  const [postFile, setPostFile] = useState(null);

  const savePost = () => {
    let formattedFileData = [];

    if (postImage) {
      formattedFileData.push({
        filename: postImage.name,
        type: "thumbnail",
      });
    }

    if (postFile) {
      formattedFileData.push({
        filename: postFile.name,
        type: "file",
      });
    }

    const formattedObj = {
      title: post.title,
      slug: post.slug,
      date: post.date,
      description: post.description,
      full_html: post.full_html,
      tags: post.tags,
      read_time: post.read_time,
      imageData: formattedFileData,
    };

    var data = new FormData();
    data.append("postData", JSON.stringify(formattedObj));
    data.append("filepath", `posts/${post.serverFilepath}`);

    if (postImage) {
      data.append("file", postImage);
    }

    if (postFile) {
      data.append("file", postFile);
    }

    axios({
      method: "post",
      url: `${baseUrl}/posts`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminJwt")}`,
      },
      data,
    })
      .then((res) => {
        alert(res.data.message);
      })
      .catch(() => {
        alert("Error saving post!");
      });
  };

  const updatePost = () => {
    let formattedFileData = [];

    if (postImage) {
      formattedFileData.push({
        filename: postImage.name,
        type: "thumbnail",
      });
    }

    if (postFile) {
      formattedFileData.push({
        filename: postFile.name,
        type: "file",
      });
    }

    const formattedObj = {
      title: post.title,
      slug: post.slug,
      date: post.date,
      description: post.description,
      full_html: post.full_html,
      tags: post.tags,
      read_time: post.read_time,
      imageData: formattedFileData,
    };

    var data = new FormData();
    data.append("postData", JSON.stringify(formattedObj));
    data.append("filepath", `posts/${post.serverFilepath}`);

    if (postImage) {
      data.append("file", postImage);
    }

    if (postFile) {
      data.append("file", postFile);
    }

    axios({
      method: "put",
      url: `${baseUrl}/posts/${post.id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminJwt")}`,
      },
      data,
    }).then(
      (res) => {
        alert(res.data.message);
      },
      (err) => {
        console.log(err);
        alert(err);
      }
    );
  };

  const deletePost = () => {
    if (confirm("Delete post yes/no?")) {
      axios({
        method: "DELETE",
        url: `${baseUrl}/posts/` + post.id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminJwt")}`,
        },
      })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const fetchPost = async (slug) => {
    axios
      .get(`${baseUrl}/posts/${slug}`)
      .then((response) => {
        if (response.data) {
          const postData = response.data.post;
          setPost({
            ...postData,
            tags: response.data.tags,
            serverFilepath: postData.server_filepath.replace("posts/", ""),
          });
        }
      })
      .catch((error) => {
        alert("Post not found!");
      });
  };

  const fetchAllPosts = () => {
    axios({
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminJwt")}`,
      },
      url: `${baseUrl}/posts`,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Wrapper>
      <EditorTitle>Post Editor</EditorTitle>
      <EditorContent>
        <SimpleGroup>
          <SimpleLabel>Fetch Post</SimpleLabel>
          <SimpleInput
            onKeyPress={(e) => {
              e.key === "Enter" ? fetchPost(e.target.value) : null;
            }}
            placeholder="Post slug (ex. multidimensional-tic-tac-toe)..."
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>Title</SimpleLabel>
          <TextField
            defaultValue={post.title}
            onTextChange={(group, value) => setPost({ ...post, title: value })}
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>Slug</SimpleLabel>
          <TextField
            defaultValue={post.slug}
            onTextChange={(group, value) => setPost({ ...post, slug: value })}
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>Description</SimpleLabel>
          <TextField
            defaultValue={post.description}
            onTextChange={(group, value) =>
              setPost({ ...post, description: value })
            }
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>Read time</SimpleLabel>
          <TextField
            defaultValue={post.read_time}
            onTextChange={(group, value) =>
              setPost({ ...post, read_time: value })
            }
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>Thumbnail</SimpleLabel>
          <FileUpload
            multiple={false}
            handleFile={(uploadedFile) => setPostImg(uploadedFile)}
          >
            {postImage && (
              <SimpleGroup
                style={{ padding: 0, width: "100%", paddingTop: 40 }}
              >
                <SimpleLabel>{postImage.name}</SimpleLabel>
              </SimpleGroup>
            )}
          </FileUpload>
        </SimpleGroup>

        <SimpleGroup>
          <SimpleLabel>Tags</SimpleLabel>
          <MultiInput
            sendToParent={(tags) => setPost({ ...post, tags })}
            defaultSelected={post.tags.length > 0 && post.tags}
          />
        </SimpleGroup>

        <SimpleGroup>
          <SimpleLabel>
            Folder name on server ("./public/posts/* here *")
          </SimpleLabel>
          <TextField
            defaultValue={post.serverFilepath}
            onTextChange={(group, value) =>
              setPost({ ...post, serverFilepath: value })
            }
          />
        </SimpleGroup>

        <SimpleGroup>
          <SimpleLabel>Additional files</SimpleLabel>
          <FileUpload
            multiple={false}
            handleFile={(uploadedFile) => {
              setPostFile(uploadedFile);
              console.log(uploadedFile, postFile);
            }}
          >
            {postFile && (
              <SimpleGroup
                style={{ padding: 0, width: "100%", paddingTop: 40 }}
              >
                <SimpleLabel>{postFile.name}</SimpleLabel>
              </SimpleGroup>
            )}
          </FileUpload>
        </SimpleGroup>
        <Editor
          value={post.full_html}
          onChange={(value) => setPost({ ...post, full_html: value })}
        />

        <EditorActions style={{ marginTop: 150 }}>
          {post.id === -1 && (
            <SimpleButton onClick={savePost}>
              <img
                src="/icons/save.svg"
                alt="save icon"
                width="32"
                height="32"
              />
            </SimpleButton>
          )}
          {post.id > -1 && (
            <SimpleButton onClick={updatePost}>
              <img
                src="/icons/save.svg"
                alt="update icon"
                width="32"
                height="32"
              />
            </SimpleButton>
          )}
          <SimpleButton onClick={deletePost}>
            <img
              src="/icons/delete.svg"
              alt="delete icon"
              width="32"
              height="32"
            />
          </SimpleButton>
          <SimpleButton onClick={() => fetchAllPosts()}>
            <img
              src="/icons/arrow-right.svg"
              alt="delete icon"
              width="32"
              height="32"
            />
          </SimpleButton>
        </EditorActions>
      </EditorContent>
    </Wrapper>
  );
};

export default PostEditor;
