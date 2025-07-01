import { createBrowserRouter } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import App from "./App";
import Calculator from "./components/Calculator";
import TaskManager from "./components/TaskManager";
import CompoundingCalculator from "./components/CompoundCal";
import IPOstudy from "./components/IPOstudy";
import MomentumStock from "./components/MomentumStock";
import FridayruleStock from "./components/FridayruleStock";
import PyramidingCalculator from "./components/PyramidingCalculator";
import TraderPsychologySurvey from "./components/Psychologyscreener";
import LearningCorner from "./components/LearningCorner";
import PrivateRoute from "./components/PrivateRoute"; // ✅

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/calculator",
    element: (
      <PrivateRoute>
        <Calculator />
      </PrivateRoute>
    ),
  },
  {
    path: "/taskmanager",
    element: (
      <PrivateRoute>
        <TaskManager />
      </PrivateRoute>
    ),
  },
  {
    path: "/compoundingcalculator",
    element: (
      <PrivateRoute>
        <CompoundingCalculator />
      </PrivateRoute>
    ),
  },
  {
    path: "/ipostudy",
    element: (
      <PrivateRoute>
        <IPOstudy />
      </PrivateRoute>
    ),
  },
  {
    path: "/momentumstock",
    element: (
      <PrivateRoute>
        <MomentumStock />
      </PrivateRoute>
    ),
  },
  {
    path: "/FridayruleStock",
    element: (
      <PrivateRoute>
        <FridayruleStock />
      </PrivateRoute>
    ),
  },
  {
    path: "/PyramidingCalculator",
    element: (
      <PrivateRoute>
        <PyramidingCalculator />
      </PrivateRoute>
    ),
  },
  {
    path: "/Psychologyscreener",
    element: (
      <PrivateRoute>
        <TraderPsychologySurvey />
      </PrivateRoute>
    ),
  },
  {
    path: "/LearningCorner",
    element: (
      <PrivateRoute>
        <LearningCorner />
      </PrivateRoute>
    ),
  },
]);
