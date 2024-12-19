import React, { useEffect } from 'react';
import { initMidi } from 'services/midiService';
import SheetMusic from 'components/SheetMusic'

function App() {
  useEffect(() => {
    initMidi();
  }, []);

  return (
    <div>
      <h1>Piano Tutor</h1>
      <SheetMusic />
    </div>
  );
}

export default App;
