export const initMidi = async () => {
  try {
    // Check if MIDI is supported
    if (navigator.requestMIDIAccess) {
      const midiAccess = await navigator.requestMIDIAccess();
      console.log("MIDI Access initialized:", midiAccess);

      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = (message) => {
          console.log("MIDI Message received:", message.data);
        };
      });

      midiAccess.onstatechange = (event) => {
        console.log("MIDI Device state change:", event);
      };
    } else {
      console.error("Web MIDI API is not supported in this browser.");
    }
  } catch (error) {
    console.error("Error initializing Web MIDI API:", error);
  }
};
