import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import FilmPage from "./pages/FilmPage.jsx"
import { Layout } from 'antd';
import './pages/index.css'
import HeaderButton from "./components/HeaderButton.jsx";
import { Link } from "react-router-dom";
import SearchResults from "./pages/SearchResults.jsx";
import { FaSearch } from "react-icons/fa";
import SearchModal from "./components/SearchModal.jsx";
import { useState, useEffect } from "react";
import { useWorks } from "./store/worksStore.jsx";
import Bangumi from "./pages/Bangumi.jsx";


const { Header, Content } = Layout;

export default function App() {

  const [searchOpen, setSearchOpen] = useState(false);

  const { loadWorks } = useWorks();
  useEffect(() => {
    loadWorks();
  }, [loadWorks]);
  

  return (
    <Layout className='mainLayout'>
      <Header className="sticky top-0 z-50 flex items-center justify-between bg-black text-white border-b border-white/10 font-heading px-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl text-white no-underline hover:text-white">
            Ayn Archive
          </Link>
          <div className="flex items-center gap-3 sm:gap-6 text-white text-base sm:text-lg">
              <HeaderButton description="影视" target="" />
              <HeaderButton description="番组" target="/bangumi"  />
              <HeaderButton description="说明" target="/upload"  />
              <button className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/10 transition-colors" onClick={() => setSearchOpen(true)}>
                <FaSearch size={18} className="text-white" />
              </button>
          </div>
      </Header>

      <Content className="mb-10">
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works/:id" element={<FilmPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/bangumi" element={<Bangumi />} />
        </Routes>
      </Content>
    </Layout>
  );
}