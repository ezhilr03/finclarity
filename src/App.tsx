import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HomePage } from "@/components/pages/home/HomePage";
import { HealthScorePage } from "@/components/pages/tools/HealthScorePage";
import { EMICheckerPage } from "@/components/pages/tools/EMICheckerPage";
import { DebtPlannerPage } from "@/components/pages/tools/DebtPlannerPage";
import { EmergencyFundPage } from "@/components/pages/tools/EmergencyFundPage";
import { FITrackerPage } from "@/components/pages/tools/FITrackerPage";
import { DashboardPage } from "@/components/pages/dashboard/DashboardPage";
import { Toaster } from "@/components/ui/toaster";
import { SEO, schemas } from "@/components/shared/SEO";

export default function App() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Global site-wide schema */}
      <SEO schema={{ ...schemas.website }} />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/health-score" element={<HealthScorePage />} />
          <Route path="/emi-checker" element={<EMICheckerPage />} />
          <Route path="/debt-planner" element={<DebtPlannerPage />} />
          <Route path="/emergency-fund" element={<EmergencyFundPage />} />
          <Route path="/fi-tracker" element={<FITrackerPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}
