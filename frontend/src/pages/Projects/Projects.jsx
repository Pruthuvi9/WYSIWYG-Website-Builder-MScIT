import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MainHeader from "../../components/Navigation/MainHeader";
import PageTitle from "../../components/UI/PageTitle";

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const getAllProjects = async () => {
    const res = await fetch("http://localhost:5000/api/projects");
    const data = await res.json();
    if (res.ok) {
      setProjects(data);
    } else {
      console.error("Failed to load projects:", data.error);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Project deleted.");
      setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error("Error deteting project:", error);
    }
  };

  const createProject = async (projectName) => {
    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName }),
      });

      const data = await response.json();
      console.log("Project created:", data.project);
      return data.project;
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const exportWebsite = async (projectId) => {
    try {
      const response = await fetch("http://localhost:5000/api/projects/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Website exported successfully!");
      } else {
        alert("Error exporting website: " + result.error);
      }
    } catch (error) {
      console.error("Error calling the backend:", error);
      alert("Error calling the backend");
    }
  };

  const handleExport = (projectId) => {
    exportWebsite(projectId);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!projectName) {
      setFieldError("Please enter a project name.");
      return;
    }

    const createdProject = await createProject(projectName);
    if (createdProject && createdProject._id) {
      navigate(`/${createdProject._id}`);
      closeFormHandler();
    } else {
      console.error("Project creation failed or missing ID.");
    }
    setProjectName("");
  };

  const openFormHandler = () => setShowForm(true);
  const closeFormHandler = () => {
    setShowForm(false);
    setFieldError("");
  };

  return (
    <>
      <MainHeader />
      <main>
        <PageTitle>Projects</PageTitle>
        <button onClick={openFormHandler} className="bg-blue-800 text-white rounded-md p-2">
          Create new project
        </button>
        <div className="project-container">
          {projects?.length > 0 ? (
            <ul className="p-4 list-disc list-inside flex flex-col gap-1">
              {projects.map((project, index) => (
                <li key={index} className="list-none">
                  <div className="bg-sky-600 text-white rounded-md p-2 flex justify-between">
                    <div>
                      <h3>
                        <a href={`/projects/${project._id}`}>{project.name}</a>
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <a href={`/projects/${project._id}`}>Open</a>
                      <button onClick={() => handleExport(project._id)}>Export</button>
                      <button onClick={() => deleteProject(project._id)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-400">No projects yet.</p>
          )}
        </div>
        {showForm && (
          <div
            onClick={closeFormHandler}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <form onSubmit={submitHandler} className="bg-white p-6 rounded-md flex flex-col gap-4 w-96">
              <h2 className="text-2xl font-semibold mb-2">Create Project</h2>

              <div className="form-control">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="border p-2 rounded"
                />
                <p className="error m-1 text-red-500">{fieldError}</p>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeFormHandler} className="bg-gray-400 text-white px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Create
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default Projects;
