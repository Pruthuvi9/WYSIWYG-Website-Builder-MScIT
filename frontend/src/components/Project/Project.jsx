import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainHeader from "../../components/Navigation/MainHeader";
import Loader from "../UI/Loader";

const Project = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [pageName, setPageName] = useState("");
  const [pagePath, setPagePath] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [nameFieldError, setNameFieldError] = useState("");
  const [pathFieldError, setPathFieldError] = useState("");
  const [loading, setLoading] = useState(true);

  const openFormHandler = () => setShowForm(true);
  const closeFormHandler = () => {
    setShowForm(false);
    setNameFieldError("");
    setPathFieldError("");
  };

  const getProject = async (projectId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}`);
      const data = await res.json();
      if (res.ok) {
        setProject(data);
        setLoading(false);
      } else {
        setLoading(false);
        console.error("Failed to load project:", data.error);
      }
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) getProject(projectId);
  }, [projectId]);

  const savePageToProject = async (pageName, pagePath) => {
    const path = "";
    const components = "";
    const html = "";
    const css = "";

    const payload = {
      name: pageName,
      path: pagePath,
      components,
      html,
      css,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Page saved successfully!", data);
        window.alert("Page saved successfully!");
        
        const newPage = { name: pageName, path: pagePath, components: "", html: "", css: "" };

        setProject((prevProject) => ({
          ...prevProject,
          pages: [...prevProject.pages, newPage],
        }));
      } else {
        console.error("Failed to save page:", data.error);
        
      }
    } catch (error) {
      console.error("Error while saving:", error);
    }
  };

  const deleteHandler = async (pageName) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this page?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/pages/${pageName}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        if (res.ok) {
          console.log("Page deleted successfully!", data);
          window.alert("Page deleted successfully!");
          setProject((prevProject) => ({
            ...prevProject,
            pages: prevProject.pages.filter((page) => page.name !== pageName),
          }));
        }
      } else {
        console.error("Failed to delete page:", data.error);
        window.alert("Failed to delete page.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!pageName) {
      setNameFieldError("Please enter a page name.");
      return;
    }

    if (!pagePath) {
      setPathFieldError("Please enter a page path.");
      return;
    }

    const createdPage = await savePageToProject(pageName, pagePath);
    closeFormHandler();
    setPageName("");
    setPagePath("");
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

  return (
    <>
      <MainHeader />
      <main>
        <div className="project-container">
          {loading && <Loader />}
          {project ? (
            <>
              <div className="flex justify-between p-6">
                <div className="">
                  <h1 className="text-4xl">{project.name}</h1>
                </div>
                <div>
                  <button className="bg-blue-800 text-white rounded-md p-2" onClick={() => handleExport(project._id)}>
                    Export
                  </button>
                </div>
              </div>
              <div className="p-4 border rounded shadow">
                <div className="flex justify-between">
                  <h2 className="text-2xl">Pages</h2>
                  <button className="bg-blue-600 text-white rounded-md p-2" onClick={openFormHandler}>
                    Add page
                  </button>
                </div>
                {project.pages?.length > 0 ? (
                  <div>
                    <ul className="mt-4 list-disc list-inside flex flex-col gap-4">
                      {project.pages.map((page, index) => (
                        <li
                          key={index}
                          className="list-none border text-black rounded-md p-2 flex flex-col gap-2 justify-start"
                        >
                          <h3 className="text-xl">{page.name}</h3>
                          <div className="flex gap-3">
                            <a
                              className="hover:text-blue-500"
                              href={`/projects/${projectId}/pages/${page.name}/editor`}
                            >
                              Edit
                            </a>
                            <button
                              className="text-red-600 hover:text-red-400"
                              onClick={() => deleteHandler(page.name)}
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-2 text-md text-gray-400">No pages yet.</p>
                )}
              </div>
            </>
          ) : (
            <p>No project found.</p>
          )}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
              <form onSubmit={submitHandler} className="bg-white p-6 rounded-md flex flex-col gap-4 w-96">
                <h2 className="text-2xl font-semibold mb-2">Create Page</h2>

                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Page Name"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    className="border p-2 rounded"
                  />
                  <p className="error m-1 text-red-500">{nameFieldError}</p>
                </div>

                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Project Path"
                    value={pagePath}
                    onChange={(e) => setPagePath(e.target.value)}
                    className="border p-2 rounded"
                  />
                  <p className="error m-1 text-red-500">{pathFieldError}</p>
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
        </div>
      </main>
    </>
  );
};

export default Project;
