import React, {useState} from 'react'
import {Button, List, Typography, Space} from 'antd'
import {MusicNoteGeneratorService} from 'services/musicNoteGeneratorService'
import SheetMusicRenderer from 'common/SheetMusicRenderer' // Import the service

const LearnMusicNotes: React.FC = () => {
  const [notes, setNotes] = useState<string[]>([])
  const [level, setLevel] = useState<number | null>(null)

  const musicNoteGeneratorService = new MusicNoteGeneratorService() // Create an instance of the service

  // Function to handle level selection and generate notes
  const handleLevelSelect = (level: number) => {
    setLevel(level) // Set the selected level
    const generatedNotes = musicNoteGeneratorService.generateNotes(level) // Generate notes based on the level
    setNotes(generatedNotes) // Update the state with the generated notes
  }

  return (
    <div style={{padding: '20px'}}>
      <Typography.Title level={2}>Learn Music Notes</Typography.Title>

      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Typography.Text>Select a level to generate the music notes:</Typography.Text>

        {/* Render 7 buttons for levels */}
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

        {/* Display the selected level and generated notes */}
        {level !== null && (
          <div>
            <Typography.Text>
              <strong>Selected Level: </strong> {level}
            </Typography.Text>
            <SheetMusicRenderer notes={notes}/>
          </div>
        )}
      </Space>
    </div>
  )
}

export default LearnMusicNotes
