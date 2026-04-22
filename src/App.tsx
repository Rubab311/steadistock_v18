import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from './context/StoreContext';
import { AppRoutes } from './routes/AppRoutes';
import { SplashScreen } from './components/layout/SplashScreen';

export default function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <StoreProvider>
          {loading && <SplashScreen />}
          <AppRoutes />
        </StoreProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
