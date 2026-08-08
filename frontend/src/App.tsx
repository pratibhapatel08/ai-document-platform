import { AuthProvider, ToastProvider } from "@/context";
import { AppRouter } from "@/routes/AppRouter";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
