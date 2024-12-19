import React, { useEffect } from 'react';
import { initMidi } from './services/midiService';

function App() {
  useEffect(() => {
    initMidi();
  }, []);

  return (
    <div>
      <h1>Piano Tutor</h1>
      <p>Check the console for MIDI initialization logs.</p>
    </div>
  );
}

export default App;
