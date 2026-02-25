import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import FilmPage from "./pages/FilmPage.jsx"
import { Layout } from 'antd';
import './pages/index.css'
import HeaderButton from "./components/HeaderButton.jsx";
import { Link } from "react-router-dom";

const { Header, Content } = Layout;

export default function App() {
  return (
    <Layout className='mainLayout'>
      <Header className="sticky top-0 z-50 flex items-center justify-between bg-black text-white border-b border-white/10 font-heading">
          <Link to="/" className="flex items-center gap-2 text-xl text-white no-underline hover:text-white">
            Ayano Go
          </Link>
          <div className='flex items-center gap-6 text-white text-lg'>
              <HeaderButton description="影视" target="" />
              <HeaderButton description="FC" target="/fan-club" />
              <HeaderButton description="投稿/报错" target="/upload"  />
          </div>
      </Header>

      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works/:id" element={<FilmPage />} />
        </Routes>
      </Content>
    </Layout>
  );
}