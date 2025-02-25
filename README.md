# Recording Voice App

## Overview

This app enables voice recording using the Web Speech API. It supports starting, pausing, and stopping voice recognition while displaying transcribed text.

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

## Demo

[📱 Mobile Demo](https://drive.google.com/file/d/1doSomosTrj257QnRUajqqSuhTdLSdJGl/view?usp=share_link)
[💻 Desktop Demo](https://drive.google.com/file/d/1iaOG19w55I4VW04KYNrqJxFyg8NJWQ3G/view?usp=share_link)
