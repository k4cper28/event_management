// App.jsx

import AuthProvider from "react-auth-kit";
import RoutesPage from "./RoutesPage";
import { ThemeProvider } from "./components/ThemeProvider";
import createStore from "react-auth-kit/createStore";
import { Toaster } from "@/components/ui/toaster";

const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

function App() {
  return (

    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<AuthProvider store={store}>
      <RoutesPage />
				<Toaster />
			</AuthProvider>
		</ThemeProvider>


  );
}

export default App;
