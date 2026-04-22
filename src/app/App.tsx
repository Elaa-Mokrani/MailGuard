import { RouterProvider } from "react-router";  // ← Changez cette ligne
import { router } from "./routes";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}