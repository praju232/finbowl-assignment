import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./layout/DashboardLayout";
import { DisbursementListPage } from "./pages/DisbursementListPage";
import { LoanDetailsPage } from "./pages/LoanDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/disbursement" replace />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route path="dashboard" element={<Navigate to="/disbursement" replace />} />
        <Route path="disbursement" element={<DisbursementListPage />} />
        <Route path="disbursement/:id" element={<LoanDetailsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/disbursement" replace />} />
    </Routes>
  );
}

export default App;
