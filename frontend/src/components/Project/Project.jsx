import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainHeader from "../../components/Navigation/MainHeader";

const Project = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [pageName, setPageName] = useState("");
  const [pagePath, setPagePath] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [nameFieldError, setNameFieldError] = useState("");
  const [pathFieldError, setPathFieldError] = useState("");

  const openFormHandler = () => setShowForm(true);
  const closeFormHandler = () => {
    setShowForm(false);
    setNameFieldError("");
    setPathFieldError("");
  };

  const getProject = async (projectId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}`);
      const data = await res.json();
      if (res.ok) {
        setProject(data); // save project to state
      } else {
        console.error("Failed to load project:", data.error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // projectId = "680bccab9e2057d2082d2ca2";

  useEffect(() => {
    if (projectId) getProject(projectId);
  }, [projectId]);

  const savePageToProject = async (pageName, pagePath) => {
    const path = "";
    const components = "";
    const html = ""; // if available
    const css = ""; // if available

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
      // console.log(data);
      if (res.ok) {
        console.log("✅ Page saved successfully!", data);
        // You can show a toast or alert if you want
        const newPage = { name: pageName, path: pagePath, components: "", html: "", css: "" };

        setProject((prevProject) => ({
          ...prevProject,
          pages: [...prevProject.pages, newPage],
        }));
      } else {
        console.error("Failed to save page:", data.error);
        // Optionally show an error toast
      }
    } catch (error) {
      console.error("Error while saving:", error);
    }
  };

  const deleteHandler = async (pageName) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/pages/${pageName}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      // console.log(data);
      if (res.ok) {
        if (res.ok) {
          console.log("Page deleted successfully!", data);
          // Update local project state to remove the deleted page
          setProject((prevProject) => ({
            ...prevProject,
            pages: prevProject.pages.filter((page) => page.name !== pageName),
          }));
        }
      } else {
        console.error("Failed to delete page:", data.error);
        // Optionally show an error toast
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
    if (createdPage) {
      console.log(`Successfully created the page: ${pageName}`);
    } else {
      console.error("Page creation failed or missing ID.");
    }
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
          {project ? (
            <>
              <div className="flex justify-between p-6">
                <div className="">
                  <h1 className="text-4xl">{project.name}</h1>
                </div>
                <div>
                  <button onClick={() => handleExport(project._id)}>Export</button>
                </div>
              </div>
              <div className="p-4 border rounded shadow">
                {project.pages?.length > 0 ? (
                  <div>
                    <h2>Pages</h2>
                    <ul className="mt-4 list-disc list-inside">
                      {project.pages.map((page, index) => (
                        <li key={index}>
                          <strong>{page.name}</strong>
                          <a href={`/projects/${projectId}/pages/${page.name}/editor`}>Edit</a>
                          <button onClick={() => deleteHandler(page.name)}>Delete</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-400">No pages yet.</p>
                )}
                <button onClick={openFormHandler}>Add page</button>
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
