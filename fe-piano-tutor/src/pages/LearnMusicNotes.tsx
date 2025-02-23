import { useState, FC } from 'react';
import { Button, Typography, Space } from 'antd';
import { MusicNoteGeneratorService } from 'services/musicNoteGeneratorService';
import SheetMusicRenderer from 'common/SheetMusicRenderer';
import { StaveNote } from 'vexflow';

const LearnMusicNotes: FC = () => {
  const [notes, setNotes] = useState<StaveNote[]>([]);
  const [level, setLevel] = useState<number | null>(null);
  const musicNoteGeneratorService = new MusicNoteGeneratorService();

  // Remove the first note that matches the played note (case-insensitive)
  const handleNotePlayed = (playedNote: string) => {
    setNotes((prevNotes) => {
      const noteIndex = prevNotes.findIndex((note) => {
        // Comparing lower-case versions to be case-insensitive
        return note.getKeys()[0].toLowerCase() === playedNote.toLowerCase();
      });
      if (noteIndex > -1) {
        const updatedNotes = [...prevNotes];
        updatedNotes.splice(noteIndex, 1); // Remove the played note
        return updatedNotes;
      }
      return prevNotes;
    });
  };

  // Generate notes when a level is selected
  const handleLevelSelect = (level: number) => {
    setLevel(level);
    const generatedNotes = musicNoteGeneratorService.generateNotes(level);
    setNotes(generatedNotes);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={2}>Learn Music Notes</Typography.Title>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
            <SheetMusicRenderer notes={notes} onNotePlayed={handleNotePlayed} />
          </div>
        )}
      </Space>
    </div>
  );
};

export default LearnMusicNotes;
