// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// hooks
import useAuth from './hooks/useAuth';
// components
import NotistackProvider from './components/NotistackProvider';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import ThemeLocalization from './components/ThemeLocalization';
import LoadingScreen, { ProgressBarStyle } from './components/LoadingScreen';

// ----------------------------------------------------------------------

export default function App() {
  // const { isInitialized } = useAuth();

  if (document.addEventListener) {
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  } else {
    document.attachEvent('oncontextmenu', (event) => {
      window.event.returnValue = false;
    });
  }
  document.addEventListener('keydown', (event) => {
    // Prevent F12 -
    if (event.keyCode === 123) {
      event.preventDefault();
      return;  
    }
    // Prevent Ctrl+a = disable select all
    // Prevent Ctrl+u = disable view page source
    // Prevent Ctrl+s = disable save
    if (event.ctrlKey && (event.keyCode === 85 || event.keyCode === 83 || event.keyCode ===65 )){
      event.preventDefault();
      return;
    }
    // Prevent Ctrl+Shift+I = disabled debugger console using keys open
    if (event.ctrlKey && event.shiftKey && event.keyCode === 73){
      event.preventDefault();
      return false;
    }
  });
  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <ThemeLocalization>
            <NotistackProvider>
              <GlobalStyles />
              <ProgressBarStyle />
              <Router />
              {/* {isInitialized ? <Router /> : <LoadingScreen />} */}
            </NotistackProvider>
        </ThemeLocalization>
      </ThemePrimaryColor>
    </ThemeConfig>
  );
}
