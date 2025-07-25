import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import UserRoutes from "./routes/UserRoutes";
// import AdminRoutes from "./routes/AdminRoutes";
import { persistor, store } from "../src/redux/storefile/store";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthRedirect from "./components/protecters/AuthRedirect";
import { ThemeProvider } from "./components/layouts/ThemeProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={"Loading"} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Toaster richColors position="bottom-right" />
            <Router>
              <Routes>
                <Route path="/*" element={<UserRoutes />} />
                <Route
                  path="auth/*"
                  element={
                    <AuthRedirect>
                      <AuthRoutes />
                    </AuthRedirect>
                  }
                />
              </Routes>
            </Router>
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;