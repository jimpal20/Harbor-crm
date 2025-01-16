import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import MainLanding from "./pages/landing/MainLanding";
import PeopleHub from "./pages/people/PeopleHub";
import ClientsView from "./pages/people/ClientsView";
import LeadsView from "./pages/people/LeadsView";
import AllPeopleView from "./pages/people/AllPeopleView";
import ContactPage from "./pages/contacts/ContactPage";
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<MainLanding />} />
              <Route path="people">
                <Route index element={<PeopleHub />} />
                <Route path="clients" element={<ClientsView />} />
                <Route path="leads" element={<LeadsView />} />
                <Route path="all" element={<AllPeopleView />} />
              </Route>
              <Route path="contacts/:contactId" element={<ContactPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;