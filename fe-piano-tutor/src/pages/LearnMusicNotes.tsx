import {useState, FC, useEffect, memo} from 'react'
import {Button, Typography, Space, notification} from 'antd'
import {MusicNoteGeneratorService} from 'services/musicNoteGeneratorService'
import SheetMusicRenderer from 'common/SheetMusicRenderer'
import {StaveNote} from 'vexflow'
import {useSelector} from 'react-redux'
import {RootState} from 'store'

const LearnMusicNotes: FC = memo(() => {
  const [notes, setNotes] = useState<StaveNote[]>([])
  const [level, setLevel] = useState<number | null>(null)
  const musicNoteGeneratorService = new MusicNoteGeneratorService()
  const {score} = useSelector((state: RootState) => state.musicNotes)
  // Remove the first note from the array (when correctly played)
  const handleCorrectNote = () => {
    const newNotes = notes.slice(1)
    setNotes(newNotes)
  }

  console.log('score: ', score)

  // Show final score when all notes are played.
  useEffect(() => {
    if (level !== null && notes.length === 0) {
      notification.success({
        message: 'Practice Complete',
        description: `Your score is: ${score}`
      })
    }
  }, [notes, level, score])

  const handleLevelSelect = (level: number) => {
    console.log('Select Level')
    setLevel(level)
    const generatedNotes = musicNoteGeneratorService.generateNotes(level)
    console.log('Generated NOtes', generatedNotes.length)
    setNotes(generatedNotes)
  }

  return (
    <div style={{padding: '20px'}}>
      <Typography.Title level={2}>Learn Music Notes</Typography.Title>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Typography.Text>
          Select a level to generate the music notes:
        </Typography.Text>
        <Space>
          {[1, 2, 3, 4, 5, 6, 7].map((levelNumber) => (
            <Button
              key={levelNumber}
              type="primary"
              onClick={() => handleLevelSelect(levelNumber)}
            >
              Level {levelNumber}
            </Button>
          ))}
        </Space>
        {level !== null && (
          <div>
            <Typography.Text>
              <strong>Selected Level: </strong> {level}
            </Typography.Text>
            <SheetMusicRenderer notes={notes} onCorrectNote={handleCorrectNote}/>
          </div>
        )}
      </Space>
    </div>
  )
})

export default LearnMusicNotes
