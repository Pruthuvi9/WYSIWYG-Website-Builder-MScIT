import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MainHeader from "../../components/Navigation/MainHeader";
import Loader from "../../components/UI/Loader";

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(true);

  const getAllProjects = async () => {
    const res = await fetch("http://localhost:5000/api/projects");
    const data = await res.json();
    if (res.ok) {
      setProjects(data);
    } else {
      console.error("Failed to load projects:", data.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setLoading(false);
      window.alert("Project deleted.");
      setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error("Error deteting project:", error);
      setLoading(false);
    }
  };

  const createProject = async (projectName) => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName }),
      });

      const data = await response.json();
      console.log("Project created:", data.project);
      window.alert("Project created.");
      setLoading(false);
      return data.project;
    } catch (error) {
      setLoading(false);
      console.error("Error creating project:", error);
      window.alert("Error creating project.");
    }
  };

  const exportWebsite = async (projectId) => {
    setLoading(true);

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
        setLoading(false);
        alert("Website exported successfully!");
      } else {
        setLoading(false);
        alert("Error exporting website: " + result.error);
      }
    } catch (error) {
      setLoading(false);
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

    setLoading(true);
    const createdProject = await createProject(projectName);
    if (createdProject && createdProject._id) {
      setLoading(false);
      closeFormHandler();
      navigate(`/projects/${createdProject._id}`);
    } else {
      setLoading(false);
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
        <div className="p-6 border-b border-gray-600 flex justify-between">
          <h1 className="text-4xl">Projects</h1>
          <button onClick={openFormHandler} className="bg-blue-800 text-white rounded-md p-2">
            Create new project
          </button>
        </div>
        <div className="project-container">
          {loading && <Loader />}
          {projects?.length > 0 ? (
            <ul className="p-4 list-disc list-inside flex flex-col gap-3">
              {projects.map((project, index) => (
                <li key={index} className="list-none">
                  <div className="border text-black rounded-md p-2 flex flex-col gap-2">
                    <div>
                      <h3 className="text-2xl hover:text-blue-500">
                        <a href={`/projects/${project._id}`}>{project.name}</a>
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <a className="hover:text-blue-500" href={`/projects/${project._id}`}>
                        Open
                      </a>
                      <button className="hover:text-blue-500" onClick={() => handleExport(project._id)}>
                        Export
                      </button>
                      <button className="text-red-600 hover:text-red-400" onClick={() => deleteProject(project._id)}>
                        Delete
                      </button>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
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
