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
  SettingOutlined
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

// Import new authentication pages
import Register from 'pages/Auth/Register'
import Login from 'pages/Auth/Login'
import PasswordReset from 'pages/Auth/PasswordReset'

const {Sider, Content} = Layout

function App() {
  useEffect(() => {
    initMidi()
  }, [])

  return (
    <Provider store={store}>

      <Router>
        <Layout style={{minHeight: '100vh'}}>
          {/* Vertical Menu */}
          <Sider width={280} style={{background: '#fff'}} className="shadow-lg">
            <div style={{
              padding: '16px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 700,
              color: '#512da8',
              borderBottom: '1px solid #f0f0f0'
            }}>
              AI Piano Tutor
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{height: 'calc(100% - 53px)', borderRight: 0}}
            >
              <Menu.Item key="2" icon={<BookOutlined/>}><Link to="/music-theory">Music Theory</Link></Menu.Item>
              <Menu.Item key="1" icon={<ReadOutlined/>}><Link to="/learn-music-notes">Learn Music
                Notes</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<PlayCircleOutlined/>}><Link to="/learn-songs">Practice with
                Songs</Link></Menu.Item>
              <Menu.Item key="4" icon={<ThunderboltOutlined/>}><Link to="/challenge-yourself">Challenge
                Yourself</Link></Menu.Item>
              <Menu.Item key="5" icon={<BarChartOutlined/>}><Link to="/results">Results</Link></Menu.Item>
              <Menu.Item key="6" icon={<SoundOutlined/>}><Link to="/sound-test">Sound Test</Link></Menu.Item>
              <Menu.Item key="7" icon={<SettingOutlined/>}>
                <Link to="/settings">Settings</Link>
              </Menu.Item>
              <Menu.Item key="8" icon={<ReadOutlined/>}>
                <Link to="/auth/register">Register</Link>
              </Menu.Item>
              <Menu.Item key="9" icon={<ReadOutlined/>}>
                <Link to="/auth/login">Login</Link>
              </Menu.Item>
              <Menu.Item key="10" icon={<ReadOutlined/>}>
                <Link to="/auth/password-reset">Password Reset</Link>
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
                overflow: 'auto', // Make content scrollable
                marginBottom: '170px' // Add bottom margin to avoid overlap with VirtualPiano
              }}
            >
              <Routes>
                <Route path="/music-theory" element={<MusicTheory/>}/>
                <Route path="/learn-music-notes" element={<LearnMusicNotes/>}/>
                <Route path="/learn-songs" element={<SongLibrary/>}/>
                <Route path="/learn-songs/:songId" element={<LearnSongPage/>}/>
                <Route path="/challenge-yourself" element={<div><h2>Challenge Yourself</h2></div>}/>
                <Route path="/results" element={<Results/>}/>
                <Route path="/sound-test" element={<SoundTest/>}/>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/auth/register" element={<Register/>}/>
                <Route path="/auth/login" element={<Login/>}/>
                <Route path="/auth/password-reset" element={<PasswordReset/>}/>
                <Route path="/" element={<LearnMusicNotes/>}/>
              </Routes>
            </Content>
          </Layout>
        </Layout>
        <VirtualPiano/>
      </Router>
    </Provider>
  )
}

export default App
