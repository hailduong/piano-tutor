import React, {FC} from 'react'
import {Button, Typography, Card, Space, Row, Col, Statistic, Tabs} from 'antd'
import {useSelector} from 'react-redux'
import {useNavigate, useLocation, Link} from 'react-router-dom'
import {RootState} from 'store'
import {TrophyOutlined, ArrowLeftOutlined, ReloadOutlined, BookOutlined, SoundOutlined} from '@ant-design/icons'
import MusicTheoryStats from 'pages/Dashboard/MusicTheoryStats'
import LearnMusicNotesStats from 'pages/Dashboard/LearnMusicNotesStats'
import SongPracticeStats from 'pages/Dashboard/SongPracticeStats'

const {TabPane} = Tabs

type TLocationState = {
  source?: string;
  message?: string;
}

const Dashboard: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as TLocationState
  const user = useSelector((state: RootState) => state.auth.user)

  const sourceActivity = state?.source || 'practice'
  const message = user ? `Welcome, ${user.firstName}!` : (state?.message || 'Welcome!')

  /* Render */
  return (
    <div style={{padding: '20px', textAlign: 'center'}}>
      <Card className="shadow" style={{maxWidth: 768, margin: '0 auto', padding: 20}}>
        <TrophyOutlined style={{fontSize: 48, color: '#faad14', marginBottom: 16}}/>
        <h2>{message}</h2>
        <p>{user ? 'Check out your stats to continue learning!' : <Link to="/auth/login">Log in to save your progress.</Link>}</p>
        <Tabs defaultActiveKey={sourceActivity === 'learn-music-notes' ? 'learnMusicNotes' : 'musicTheory'} centered>
          {/* Music Theory Stats */}
          <TabPane
            tab={<span><BookOutlined/> Music Theory</span>}
            key="musicTheory"
          >
            <MusicTheoryStats/>
          </TabPane>

          {/* Learn Music Notes Stats */}
          <TabPane
            tab={<span><TrophyOutlined/> Learn Music Notes</span>}
            key="learnMusicNotes"
          >
            <LearnMusicNotesStats/>
          </TabPane>
          <TabPane
            tab={
              <span>
                <SoundOutlined /> Song Practice
              </span>
            }
            key="songPractice"
          >
            <SongPracticeStats />
          </TabPane>
        </Tabs>

        {/* Bottom Actions */}
        <Space style={{marginTop: 20}}>
          {sourceActivity === 'learn-music-notes' && (
            <Button
              type="primary"
              icon={<ReloadOutlined/>}
              block
              onClick={() => navigate('/learn-music-notes')}
            >
              Practice Again
            </Button>
          )}
          {sourceActivity === 'music-theory' && (
            <Button
              type="primary"
              icon={<BookOutlined/>}
              block
              onClick={() => navigate('/music-theory')}
            >
              Return to Music Theory
            </Button>
          )}
          {sourceActivity === 'song-practice' && (
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              block
              onClick={() => navigate('/song-practice')}
            >
              Practice Again
            </Button>
          )}
        </Space>
      </Card>
    </div>
  )
}

export default Dashboard
