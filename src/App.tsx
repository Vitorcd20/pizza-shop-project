import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";

export function App() {
  return (
    <HelmetProvider>
      <Toaster richColors />
      <Helmet titleTemplate="%s | pizza.shop" />

      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;
