import { 
  createBrowserRouter, 
  RouterProvider 
} from "react-router-dom";

import { CreateTripPage } from "./pages/create-trip/steps";
import { TripDetailsPage } from "./pages/create-trip/trip-details";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateTripPage />,
  },

  {
    path: "/trips/:tripId",
    element: <TripDetailsPage />,
  },
]);

export function App() {
  return (
    <RouterProvider router={router} />
  )
};

