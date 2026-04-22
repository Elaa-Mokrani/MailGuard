import { createBrowserRouter } from "react-router";  // ← Changez cette ligne
import { EmailLayout } from "./components/EmailLayout";
import EmailDashboard from "./pages/EmailDashboard";
import EmailAnalysis from "./pages/EmailAnalysis";
import AnalyseRisque from "./pages/AnalyseRisque";
import Clients from "./pages/Clients";
import Alertes from "./pages/Alertes";
import Historique from "./pages/Historique";
import Parametres from "./pages/Parametres";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <EmailLayout><EmailDashboard /></EmailLayout>,
  },
  {
    path: "/emails",
    element: <EmailLayout><EmailAnalysis /></EmailLayout>,
  },
  {
    path: "/analyse-risque",
    element: <EmailLayout><AnalyseRisque /></EmailLayout>,
  },
  {
    path: "/clients",
    element: <EmailLayout><Clients /></EmailLayout>,
  },
  {
    path: "/alertes",
    element: <EmailLayout><Alertes /></EmailLayout>,
  },
  {
    path: "/historique",
    element: <EmailLayout><Historique /></EmailLayout>,
  },
  {
    path: "/parametres",
    element: <EmailLayout><Parametres /></EmailLayout>,
  },
  {
    path: "*",
    element: <EmailLayout><NotFound /></EmailLayout>,
  },
]);