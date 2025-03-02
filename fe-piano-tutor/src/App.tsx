import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom'
import {Layout, Menu} from 'antd'
import {ReadOutlined, BookOutlined, PlayCircleOutlined, ThunderboltOutlined, BarChartOutlined} from '@ant-design/icons'
import {initMidi} from 'utils/midiUtil'
import LearnMusicNotes from 'pages/LearnMusicNotes'
import VirtualPiano from 'common/VirtualPiano'
import {Provider} from 'react-redux'
import store from 'store/store'
import Results from 'pages/Results'
import MusicTheory from 'pages/MusicTheory'
import {MusicTheoryProvider} from 'contexts/MusicTheoryContext'
import SongLibrary from 'pages/SongLibrary'


// Placeholder components for the new menu items
const ChallengeYourself = () => <div><h2>Challenge Yourself</h2></div>

const {Sider, Content} = Layout

function App() {
  useEffect(() => {
    initMidi()
  }, [])

  return (
    <Provider store={store}>
      <MusicTheoryProvider>
        <Router>
          <Layout style={{minHeight: '100vh'}}>
            {/* Vertical Menu */}
            <Sider width={200} style={{background: '#fff'}}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{height: '100%', borderRight: 0}}
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
              </Menu>
            </Sider>

            {/* Main Content Area */}
            <Layout style={{padding: '0 24px 24px'}}>
              <Content
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280
                }}
              >
                <Routes>
                  <Route path="/music-theory" element={<MusicTheory/>}/>
                  <Route path="/learn-music-notes" element={<LearnMusicNotes/>}/>
                  <Route path="/learn-songs" element={<SongLibrary/>}/>
                  <Route path="/challenge-yourself" element={<ChallengeYourself/>}/>
                  <Route path="/results" element={<Results/>}/>
                  {/* Default route */}
                  <Route path="/" element={<LearnMusicNotes/>}/>
                </Routes>
              </Content>
            </Layout>
          </Layout>
          <VirtualPiano/>
        </Router>
      </MusicTheoryProvider>
    </Provider>
  )
}

export default App
