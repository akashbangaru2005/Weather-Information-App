
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";
import { WeatherProvider } from "./context/WeatherContext";

function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <Dashboard />
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;
