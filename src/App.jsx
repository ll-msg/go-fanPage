import { Layout } from 'antd';
import './App.css'
import HeaderButton from './components/HeaderButton';
import FilmList from './components/FilmList';

const { Header, Content, Footer } = Layout;

function App() {

  return (
    <Layout className='mainLayout'>
        <Header className="sticky top-0 z-50 flex items-center justify-between bg-black text-white border-b border-white/10 font-heading">
            <a href=""  className="flex items-center gap-2 text-xl text-white no-underline hover:text-white">
                Ayano Go
            </a>
            <div className='flex items-center gap-6 text-white'>
                <HeaderButton description="影视列表" target="how-it-works" />
                <HeaderButton description="投稿/报错" target="future"  />
            </div>
        </Header>

        <Content>
          <FilmList />
        </Content>

    </Layout>
  )
}

export default App
