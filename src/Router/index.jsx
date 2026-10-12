import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import Home from "../Pages/Home";
import Protected from "../Layout/Protected";
import Cart from "../Pages/Cart";
import InstructorProfile from "../Pages/InstructorProfile";
import StudentProfile from "../Pages/StudentProfile";
import UnProtected from "../Layout/UnProtected";
import Auth from "../Pages/Auth";
import Course from "../Pages/Course";
import Lesson from "../Pages/Lesson";
import Category from "../Pages/Category";
import About from "../Pages/About";
import Instructors from "../Pages/Instructors";
import NotFound from "../Pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <Protected />,
        children: [
          {
            path: "/cart",
            element: <Cart />,
          },
          {
            path: "/instructor-profile",
            element: <InstructorProfile />,
          },
          {
            path: "/profile",
            element: <StudentProfile />,
          },
        ],
      },
      {
        element: <UnProtected />,
        children: [{ path: "/auth", element: <Auth /> }],
      },
      {
        path: "/courses/:courseId/:courseName",
        element: <Course />,
      },
      {
        path: "/lesson/:lessonId/:lessonName",
        element: <Lesson />,
      },
      {
        path: "/categories/:categoryName/:categoryId",
        element: <Category />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/instructors/:id/:name",
        element: <Instructors />,
      },
      {
        path: "/*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
