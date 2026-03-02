import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
// PAGES
import ProjectsPage from "./pages/projectPage";
import ProjectAssistPage from "./pages/projectAssistPage";
import LandingPage from "./pages/landingPage";


import "./App.css";
import Appbar from "./components/appbar/appbar";

function App() {

  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: 'EYInterstate-Regular, sans-serif',
      },
    },
    components: {
      MuiTooltip: {
        defaultProps: {
          enterDelay: 100,    
          leaveDelay: 0,
        },
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: '#fff',
            boxShadow: theme.shadows[1],
            fontSize: theme.typography.pxToRem(12),
            padding: '6px 8px',
            borderRadius: 4,
            border: '1px solid rgba(0,0,0,0.9)',
          }),
          arrow: {
            color: 'rgba(0, 0, 0, 0.85)',
            '&:before': {
              border: '1px solid rgba(0,0,0,0.9)',
            },
          },

        },
      },
    },
  });


  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectAssistPage />} />
          <Route path="/test" element={<Appbar />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;

