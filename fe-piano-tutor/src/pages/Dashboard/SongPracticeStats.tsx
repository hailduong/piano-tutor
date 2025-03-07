import React from 'react'
import { Table } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from 'store'

const SongPracticeStats: React.FC = () => {
  const songPracticeStats = useSelector((state: RootState) => state.performance.songPractice)

  const columns = [
    {
      title: 'Song ID',
      dataIndex: 'songId',
      key: 'songId'
    },
    {
      title: 'Played Notes',
      dataIndex: 'playedNotes',
      key: 'playedNotes'
    },
    {
      title: 'Correct Notes',
      dataIndex: 'correctNotes',
      key: 'correctNotes'
    },
    {
      title: 'Incorrect Notes',
      dataIndex: 'incorrectNotes',
      key: 'incorrectNotes'
    },
    {
      title: 'Accuracy (%)',
      dataIndex: 'noteAccuracy',
      key: 'noteAccuracy',
      render: (accuracy: number) => accuracy.toFixed(1)
    }
  ]

  return (
    <div>
      <Table
        dataSource={songPracticeStats.map((stat) => ({ ...stat, key: stat.songId }))}
        columns={columns}
        pagination={false}
      />
    </div>
  )
}

export default SongPracticeStats
