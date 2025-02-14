# Recording Voice App

## Overview

`RecordVoicePage` is a React component that enables voice recording using the Web Speech API. It supports starting, pausing, and stopping voice recognition while displaying transcribed text in real time.

## Features

- **Start Recording**: Begins voice recognition and continuously transcribes speech.
- **Pause Recording**: Temporarily stops recognition while keeping the recorded text.
- **Stop Recording**: Fully stops recognition and clears the recorded text.
- **Continuous Recognition**: Automatically restarts listening if the user stops speaking.

## Technologies Used

- **React** (Functional Components, Hooks)
- **Material-UI** (UI Components, Styling)
- **SCSS** (Styling)
- **Web Speech API** (SpeechRecognition)

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <project-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

## Usage

The component provides a simple UI with buttons to control speech recognition:

- **Play Button**: Starts/resumes recording.
- **Pause Button**: Pauses recording.
- **Stop Button**: Stops and clears recorded text.

## Code Explanation

### **State & References**

- `isActive`: Tracks if speech recognition is active.
- `isPause`: Tracks if recognition is paused.
- `text`: Stores transcribed speech.
- `recognitionRef`: Holds the `SpeechRecognition` instance.
- `isActiveRef`, `isPauseRef`, `speechRef`: Keep track of state values inside event handlers.

### **Speech Recognition Setup**

```tsx
const initializeRecognition = useCallback(() => {
  if (!isActive) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.onstart = () => setIsActive(true);

    recognitionRef.current.onend = () => {
      if (isActiveRef.current && !isPauseRef.current) {
        recognitionRef.current?.start();
      }
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prevText) => prevText ? `${prevText}, ${transcript}` : transcript);
    };
  }

  recognitionRef.current?.start();
}, [isActive]);
```

### **Event Handlers**

- ``: Starts or resumes recognition.
- ``: Stops recognition but keeps text.
- ``: Aborts recognition and clears text.

```tsx
const handleOnRecord = useCallback(() => {
  if (isPause) setIsPause(false);
  initializeRecognition();
}, [isPause, initializeRecognition]);

const handleOnPause = useCallback(() => {
  recognitionRef.current?.stop();
  setIsPause(true);
  setText((prev) => prev + '\n');
}, []);

const handleOnStop = useCallback(() => {
  recognitionRef.current?.abort();
  recognitionRef.current = null;
  setIsActive(false);
  setIsPause(false);
  setText('');
}, []);
```

## Known Issues & Improvements

- **Browser Support**: The Web Speech API is supported in Chrome but has limited support in other browsers.
- **Auto Restart Delay**: Consider adding a short delay before restarting recognition in `onend`.
- **Multiple Language Support**: Can be extended by allowing users to select a language before starting recognition.

## Contributing

Feel free to submit issues or contribute by opening a pull request!

## License

This project is licensed under [MIT License](LICENSE).
