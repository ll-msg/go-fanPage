import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import FilmPage from "./pages/FilmPage.jsx"
import { Layout, Drawer } from 'antd';
import './pages/index.css'
import HeaderButton from "./components/HeaderButton.jsx";
import { Link } from "react-router-dom";
import SearchResults from "./pages/SearchResults.jsx";
import { FaSearch, FaBars } from "react-icons/fa";
import SearchModal from "./components/SearchModal.jsx";
import { useState, useEffect } from "react";
import { useWorks } from "./store/worksStore.jsx";
import Bangumi from "./pages/Bangumi.jsx";
import Info from "./pages/Info.jsx";
import Make from "./pages/Make.jsx";
import Magazine from "./pages/Magazine.jsx";


const { Header, Content } = Layout;

export default function App() {

  const [searchOpen, setSearchOpen] = useState(false);
  const { loadWorks, clearScopeIds, loadMagazines } = useWorks();
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    loadWorks();
    loadMagazines();
  }, [loadWorks, loadMagazines]);
  

  return (
    <Layout className='mainLayout'>
      <Header className="sticky top-0 z-50 flex items-center justify-between bg-black text-white border-b border-white/10 font-heading px-3 sm:px-6">
          <Link to="" className="font-cute flex items-center gap-2 text-lg sm:text-xl text-white no-underline hover:text-white" onClick={() => clearScopeIds()}>
            Ayn Archive
          </Link>
          <div className="hidden md:flex items-center gap-3 lg:gap-6 text-white text-base sm:text-lg">
              <HeaderButton description="影视" target="" onClick={() => clearScopeIds()} />
              <HeaderButton description="表纸杂" target="/magazine" onClick={() => clearScopeIds()}  />
              <HeaderButton description="番组" target="/bangumi" onClick={() => clearScopeIds()}  />
              <HeaderButton description="工具" target="/make" onClick={() => clearScopeIds()}  />
              <HeaderButton description="说明" target="/info" onClick={() => clearScopeIds()}  />
              <button className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/10 transition-colors" onClick={() => setSearchOpen(true)}>
                <FaSearch size={18} className="text-white" />
              </button>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <button
              className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setSearchOpen(true)}
            >
              <FaSearch size={18} className="text-white" />
            </button>
            <button
              className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(true)}
            >
              <FaBars size={18} className="text-white" />
            </button>
          </div>
          <Drawer className="!font-heading" title="菜单" placement="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
            <div className="flex flex-col gap-4 !font-heading">
              <Link to="/" onClick={() => { clearScopeIds(); setMenuOpen(false); }}>影视</Link>
              <Link to="/magazine" onClick={() => { clearScopeIds(); setMenuOpen(false); }}>表纸杂</Link>
              <Link to="/bangumi" onClick={() => { clearScopeIds(); setMenuOpen(false); }}>番组</Link>
              <Link to="/make" onClick={() => { clearScopeIds(); setMenuOpen(false); }}>工具</Link>
              <Link to="/info" onClick={() => { clearScopeIds(); setMenuOpen(false); }}>说明</Link>
            </div>
          </Drawer>
      </Header>

      <Content className="mb-10">
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works/:id" element={<FilmPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/bangumi" element={<Bangumi />} />
          <Route path="/info" element={<Info />} />
          <Route path="/make" element={<Make />} />
          <Route path="/magazine" element={<Magazine />} />
        </Routes>
      </Content>
    </Layout>
  );
}