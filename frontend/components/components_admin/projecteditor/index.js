import axios from "axios";
import { useState } from "react";
import { baseUrl } from "../../../utils/globalSettings";
import FileUpload from "../../formui/fileupload";
import MultiInput from "../../formui/multiinput";
import TextField from "../posteditor/components/TextField";
import Select from "../../formui/select";
import {
  EditorActions,
  EditorContent,
  EditorTitle,
  SimpleButton,
  SimpleGroup,
  SimpleInput,
  SimpleLabel,
  Wrapper,
} from "../styles";

const deviceTypes = [
  { id: 1, title: "desktop" },
  { id: 2, title: "laptop" },
  { id: 3, title: "iphone" },
  { id: 4, title: "android" },
  { id: 5, title: "ipad" },
];

const ProjectEditor = () => {
  const [project, setProject] = useState({
    id: -1,
    name: "",
    link: "",
    description: "",
    type: "",
    date: new Date().toISOString().substring(0, 10),
    techs: [],
    serverFilepath: "",
    roles: "",
  });
  const [projectImages, setProjectImages] = useState([]);

  const fetchProject = (id) => {
    axios({
      method: "GET",
      url: `${baseUrl}/projects/${id}`,
    })
      .then((res) => {
        if (res.data.project) {
          const foundProject = { ...res.data.project };
          if (!foundProject.techs) {
            foundProject.techs = [];
          }
          if (!foundProject.images) {
            foundProject.images = [];
          }
          setProject({
            ...foundProject,
            serverFilepath: foundProject.serverFilepath.replace(
              "projects/",
              ""
            ),
          });
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const saveProject = () => {
    let formattedFileData = [];
    for (let i = 0; i < projectImages.length; i++) {
      formattedFileData.push({
        filename: projectImages[i].name,
        device: projectImages[i].deviceType,
      });
    }

    const formattedObj = {
      name: project.name,
      link: project.link,
      description: project.description,
      date: project.date,
      type: project.type,
      techs: project.techs,
      roles: project.roles,
      imageData: formattedFileData,
    };
    var data = new FormData();
    data.append("projectData", JSON.stringify(formattedObj));
    data.append("filepath", `projects/${project.serverFilepath}`);
    projectImages.forEach((image) => {
      data.append("file", image);
    });

    axios({
      method: "post",
      url: `${baseUrl}/projects`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminJwt")}`,
      },
      data,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch(() => {});
  };

  const updateProject = () => {
    console.log("Update state: ", project);
    if (project.id > -1) {
      let formattedFileData = [];
      for (let i = 0; i < projectImages.length; i++) {
        formattedFileData.push({
          filename: projectImages[i].name,
          device: projectImages[i].deviceType,
        });
      }

      const formattedObj = {
        name: project.name,
        link: project.link,
        description: project.description,
        date: project.date,
        type: project.type,
        techs: project.techs,
        roles: project.roles,
        imageData: formattedFileData,
      };
      var data = new FormData();
      data.append("projectData", JSON.stringify(formattedObj));
      data.append("filepath", `projects/${project.serverFilepath}`);
      projectImages.forEach((image) => {
        data.append("file", image);
      });

      axios({
        method: "put",
        url: `${baseUrl}/projects/${project.id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminJwt")}`,
        },
        data,
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch(() => {});
    } else {
      alert("ID is wrong, could not update!");
    }
  };

  const deleteProject = () => {
    if (confirm("Delete tag yes/no?")) {
      if (project.id > -1) {
        axios({
          method: "DELETE",
          url: `${baseUrl}/projects/${project.id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminJwt")}`,
          },
        })
          .then((res) => {
            alert(res.data.message);
          })
          .catch((err) => {
            alert(err.message);
          });
      } else {
        alert("Could not delete the project!");
      }
    }
  };

  const fetchAllProjects = () => {
    axios({
      method: "GET",
      url: `${baseUrl}/projects`,
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
      <EditorTitle>Project Editor</EditorTitle>
      <EditorContent>
        <SimpleGroup>
          <SimpleLabel>Project ID</SimpleLabel>
          <SimpleInput
            onKeyPress={(e) => {
              e.key === "Enter" ? fetchProject(e.target.value) : null;
            }}
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>Name</SimpleLabel>
          <TextField
            defaultValue={project.name}
            onTextChange={(group, value) =>
              setProject({ ...project, name: value })
            }
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>Project url</SimpleLabel>
          <TextField
            defaultValue={project.link}
            onTextChange={(group, value) =>
              setProject({ ...project, link: value })
            }
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>Description</SimpleLabel>
          <TextField
            defaultValue={project.description}
            onTextChange={(group, value) =>
              setProject({ ...project, description: value })
            }
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>Project Type</SimpleLabel>
          <TextField
            defaultValue={project.type}
            onTextChange={(group, value) =>
              setProject({ ...project, type: value })
            }
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>Techs (hit enter to add tech)</SimpleLabel>
          <MultiInput
            sendToParent={(techs) => setProject({ ...project, techs })}
            defaultSelected={project.techs.length > 0 && project.techs}
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>
            Folder name on server ("./public/projects/* here *")
          </SimpleLabel>
          <TextField
            defaultValue={project.serverFilepath}
            onTextChange={(group, value) =>
              setProject({ ...project, serverFilepath: value })
            }
          />
        </SimpleGroup>
        <SimpleGroup>
          <SimpleLabel>Roles</SimpleLabel>
          <TextField
            defaultValue={project.roles}
            onTextChange={(group, value) =>
              setProject({ ...project, roles: value })
            }
          />
        </SimpleGroup>

        <SimpleGroup>
          <SimpleLabel>Upload Images</SimpleLabel>
          <FileUpload
            multiple={true}
            handleFile={(uploadedFiles) => {
              setProjectImages([...uploadedFiles]);
              console.log(uploadedFiles, projectImages);
            }}
          >
            {[...projectImages].map((image, i) => (
              <SimpleGroup
                key={i}
                style={{ padding: 0, width: "100%", paddingTop: 40 }}
              >
                <SimpleLabel>{image.name}</SimpleLabel>
                <Select
                  options={deviceTypes}
                  value={projectImages[i].deviceType}
                  sendToParent={(value) => {
                    if (value) {
                      let tempData = projectImages;
                      tempData[i].deviceType = value.title;
                      setProjectImages(tempData);
                    }
                  }}
                />
              </SimpleGroup>
            ))}
          </FileUpload>
        </SimpleGroup>

        <EditorActions>
          {project.id === -1 && (
            <SimpleButton onClick={() => saveProject()}>
              <img
                src="/icons/save.svg"
                alt="save icon"
                width="32"
                height="32"
              />
            </SimpleButton>
          )}
          {project.id > -1 && (
            <SimpleButton onClick={() => updateProject()}>
              <img
                src="/icons/save.svg"
                alt="update icon"
                width="32"
                height="32"
              />
            </SimpleButton>
          )}
          <SimpleButton onClick={() => deleteProject()}>
            <img
              src="/icons/delete.svg"
              alt="delete icon"
              width="32"
              height="32"
            />
          </SimpleButton>
          <SimpleButton onClick={() => fetchAllProjects()}>
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

export default ProjectEditor;
