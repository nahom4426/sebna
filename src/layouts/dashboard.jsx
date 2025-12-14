import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import routes from "@/routes";

export function Dashboard() {
  return (
    <MainLayout>
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "dashboard" &&
            pages.map(({ path, element }) => (
              <Route key={path} exact path={path} element={element} />
            ))
        )}
      </Routes>
    </MainLayout>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
