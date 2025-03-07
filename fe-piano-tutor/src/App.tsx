import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom'
import {Layout, Menu} from 'antd'
import {
  ReadOutlined,
  BookOutlined,
  PlayCircleOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  SoundOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons'
import {initMidi} from 'utils/midiUtil'
import LearnMusicNotes from 'pages/LearnMusicNotes/LearnMusicNotes'
import VirtualPiano from 'common/VirtualPiano'
import {Provider} from 'react-redux'
import store from 'store'
import Results from 'pages/Results'
import MusicTheory from 'pages/MusicTheory'
import SongLibrary from 'pages/SongLibrary'
import LearnSongPage from 'pages/LearnSong'
import SoundTest from 'pages/SoundTest'
import Settings from 'pages/Settings'
import Register from 'pages/Auth/Register'
import Login from 'pages/Auth/Login'
import PasswordReset from 'pages/Auth/PasswordReset'
import themeVars from 'styles/themeVars'

const {Header, Sider, Content} = Layout

function App() {
  useEffect(() => {
    initMidi()
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Layout style={{minHeight: '100vh'}}>
          <Header style={{
            background: themeVars.colors.primaries['900'], // dark background
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' // header shadow
          }}>
            <div style={{fontSize: '18px', fontWeight: 700, color: '#fff'}}>
              AI Piano Tutor
            </div>
            <Link to="/auth/login" style={{fontSize: '20px', color: '#fff'}}>
              <UserOutlined/>
            </Link>
          </Header>
          <Layout style={{minHeight: '100vh'}}>
            {/* Vertical Menu */}
            <Sider width={280} style={{background: '#fff'}} className="shadow-lg">
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{height: 'calc(100% - 53px)', borderRight: 0}}
              >
                <Menu.Item key="1" icon={<BarChartOutlined/>}><Link to="/results">Dashboard</Link></Menu.Item>
                <Menu.Item key="2" icon={<BookOutlined/>}><Link to="/music-theory">Music Theory</Link></Menu.Item>
                <Menu.Item key="5" icon={<ReadOutlined/>}><Link to="/learn-music-notes">Learn Music
                  Notes</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<PlayCircleOutlined/>}>
                  <Link to="/learn-songs">Practice with Songs</Link>
                </Menu.Item>
                <Menu.Item key="6" icon={<SoundOutlined/>}><Link to="/sound-test">Sound Test</Link></Menu.Item>
                <Menu.Item key="7" icon={<SettingOutlined/>}>
                  <Link to="/settings">Settings</Link>
                </Menu.Item>
              </Menu>
            </Sider>

            {/* Main Content Area */}
            <Layout style={{padding: '0 24px 24px'}}>
              <Content
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                  overflow: 'auto',
                  marginBottom: '170px'
                }}
              >
                <Routes>
                  <Route path="/music-theory" element={<MusicTheory/>}/>
                  <Route path="/learn-music-notes" element={<LearnMusicNotes/>}/>
                  <Route path="/learn-songs" element={<SongLibrary/>}/>
                  <Route path="/learn-songs/:songId" element={<LearnSongPage/>}/>
                  <Route path="/results" element={<Results/>}/>
                  <Route path="/sound-test" element={<SoundTest/>}/>
                  <Route path="/settings" element={<Settings/>}/>
                  <Route path="/auth/register" element={<Register/>}/>
                  <Route path="/auth/login" element={<Login/>}/>
                  <Route path="/auth/password-reset" element={<PasswordReset/>}/>
                  <Route path="/" element={<Results/>}/>
                </Routes>
              </Content>
            </Layout>
          </Layout>
          <VirtualPiano/>
        </Layout>
      </Router>
    </Provider>
  )
}

export default App
