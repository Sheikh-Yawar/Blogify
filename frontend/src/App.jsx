import Navbar from "./components/Navbar";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import UserAuth from "./pages/UserAuth";
import Blog from "./pages/Blog";
import { ToastContainer } from "react-toastify";
import AddBlog from "./pages/AddBlog";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/add",
      element: <AddBlog />,
    },
    {
      path: "/blog/:id",
      element: <Blog />,
    },
    { path: "/auth", element: <UserAuth /> },
  ]);

  return (
    <div className="relative">
      <RouterProvider router={router} />
      <ToastContainer className="text-black w-fit" />
    </div>
  );
}

export default App;
