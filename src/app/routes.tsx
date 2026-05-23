import { createBrowserRouter } from "react-router";
import { EmailLayout } from "./components/EmailLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import EmailDashboard from "./pages/EmailDashboard";
import EmailAnalysis from "./pages/EmailAnalysis";
import AnalyseRisque from "./pages/AnalyseRisque";
import Clients from "./pages/Clients";
import Alertes from "./pages/Alertes";
import Historique from "./pages/Historique";
import Parametres from "./pages/Parametres";
import LoginPage from "./pages/LoginPage";
import { NotFound } from "./pages/NotFound";

function ProtectedPage({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <EmailLayout>{children}</EmailLayout>
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedPage><EmailDashboard /></ProtectedPage>,
  },
  {
    path: "/emails",
    element: <ProtectedPage><EmailAnalysis /></ProtectedPage>,
  },
  {
    path: "/analyse-risque",
    element: <ProtectedPage><AnalyseRisque /></ProtectedPage>,
  },
  {
    path: "/clients",
    element: <ProtectedPage><Clients /></ProtectedPage>,
  },
  {
    path: "/alertes",
    element: <ProtectedPage><Alertes /></ProtectedPage>,
  },
  {
    path: "/historique",
    element: <ProtectedPage><Historique /></ProtectedPage>,
  },
  {
    path: "/parametres",
    element: <ProtectedPage><Parametres /></ProtectedPage>,
  },
  {
    path: "*",
    element: <ProtectedPage><NotFound /></ProtectedPage>,
  },
]);
