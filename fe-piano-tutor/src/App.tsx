import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { FileTextOutlined, TrophyOutlined } from '@ant-design/icons';
import { initMidi } from 'services/midiService';
import SheetMusic from 'components/SheetMusic';

// Placeholder components for the new menu items
const LearnMusicNotes = () => <div><h2>Learn Music Notes</h2></div>;
const PracticeSongs = () => <div><h2>Practice with Songs</h2></div>;
const ChallengeYourself = () => <div><h2>Challenge Yourself</h2></div>;

const { Sider, Content } = Layout;

function App() {
  useEffect(() => {
    initMidi();
  }, []);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Vertical Menu */}
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<FileTextOutlined />}><Link to="/learn-music-notes">Learn Music Notes</Link></Menu.Item>
            <Menu.Item key="2" icon={<TrophyOutlined />}><Link to="/practice-songs">Practice with Songs</Link></Menu.Item>
            <Menu.Item key="3" icon={<TrophyOutlined />}><Link to="/challenge-yourself">Challenge Yourself</Link></Menu.Item>
          </Menu>
        </Sider>

        {/* Main Content Area */}
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path="/learn-music-notes" element={<LearnMusicNotes />} />
              <Route path="/practice-songs" element={<PracticeSongs />} />
              <Route path="/challenge-yourself" element={<ChallengeYourself />} />
              {/* Default route to SheetMusic as an example */}
              <Route path="/" element={<SheetMusic />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
