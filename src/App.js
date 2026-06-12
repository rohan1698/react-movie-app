import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { ThemeTweaksProvider, useThemeTweaks } from './context/ThemeTweaks';
import { ModalProvider } from './context/ModalContext';
import TopBar from './components/TopBar/TopBar';
import Dock from './components/Dock/Dock';
import ContentModal from './components/ContentModal/ContentModal';
import TweaksPanel from './components/TweaksPanel/TweaksPanel';

import Trending from './Pages/Trending/Trending';
import Movies from './Pages/Movies/Movies';
import Series from './Pages/Series/Series';
import Search from './Pages/Search/Search';
import Error from './Pages/Error/Error';

function Shell() {
  const { rootStyle, ambient } = useThemeTweaks();
  const location = useLocation();
  const scrollRef = useRef(null);

  // Reset the panel scroll position whenever the route changes.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="app-root" style={rootStyle}>
      <div className="ambient" data-theme={ambient}><div className="grain" /></div>

      <div className="stage">
        <TopBar />
        <div className="panel">
          <div className="panel-scroll" ref={scrollRef}>
            <Routes>
              <Route path="/" element={<Trending />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/series" element={<Series />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </div>
          <Dock />
        </div>
      </div>

      <ContentModal />
      <TweaksPanel />
    </div>
  );
}

function App() {
  return (
    <ThemeTweaksProvider>
      <ModalProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </ModalProvider>
    </ThemeTweaksProvider>
  );
}

export default App;
