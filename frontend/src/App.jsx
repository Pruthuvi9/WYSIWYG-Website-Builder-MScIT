import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainHeader from "./components/Navigation/MainHeader";
import PageTitle from "./components/UI/PageTitle";
import "./App.css";

function App() {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const openFormHandler = () => setShowForm(true);
  const closeFormHandler = () => {
    setShowForm(false);
    setFieldError("");
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!projectName) {
      setFieldError("Please enter a project name.");
      return;
    }

    const createdProject = await createProject(projectName);
    if (createdProject && createdProject._id) {
      navigate(`/projects/${createdProject._id}`);
    } else {
      console.error("Project creation failed or missing ID.");
    }
    closeFormHandler();
    setProjectName("");
  };

  return (
    <>
      <MainHeader />
      <main>
        <PageTitle>Dashboard</PageTitle>
        <div className="flex flex-col p-6 gap-1">
          <button onClick={openFormHandler} className="bg-blue-800 text-white rounded-md p-2">
            Create new project
          </button>
          <a className="bg-blue-800 text-white rounded-md p-2" href="/projects">
            All projects
          </a>
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
}

export default App;
