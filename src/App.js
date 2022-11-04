// import { BrowserRouter } from 'react-router-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css';


import Header from './components/Header/Header';
import MainNav from './components/MainNav/MainNav';
import { Container } from '@mui/material';
import Trending from './Pages/Trending/Trending';
import Movies from './Pages/Movies/Movies';
import Series from './Pages/Series/Series';
import Search from './Pages/Search/Search';
import Error from './Pages/Error/Error';


// const API_URL = "https://api.themoviedb.org/3/movie/550?api_key="

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="app">
          <Container>
            <Routes>
              <Route path='/' element={<Trending />} exact />
              <Route path='/movies' element={<Movies />} />
              <Route path='/series' element={<Series />} />
              <Route path='/search' element={<Search />} />
              <Route path='*' element={<Error />} />
            </Routes>
          </Container>
        </div>
        <MainNav />
      </BrowserRouter>
    </>
  );
}

export default App;
