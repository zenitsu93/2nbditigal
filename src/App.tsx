import { RouterProvider } from "react-router";
import { ThemeModeScript, ThemeProvider } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from "./routes/Router";
import { AuthProvider } from './contexts/AuthContext';
import ClickSpark from './components/shared/ClickSpark';
import SmoothCursor from './components/shared/SmoothCursor';


function App() {

  return (
    <>
      <ThemeModeScript />
      <ThemeProvider theme={customTheme}>
        <AuthProvider>
          <SmoothCursor
            color="#D4AF37"
            size={12}
            springConfig={{
              damping: 100,
              stiffness: 2000,
              mass: 0.1,
              restDelta: 0.0001,
            }}
          />
          <ClickSpark
            sparkColor="#D4AF37"
            sparkSize={20}
            sparkRadius={40}
            sparkCount={16}
            duration={800}
            extraScale={1.5}
          >
      <RouterProvider router={router} />
          </ClickSpark>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;

