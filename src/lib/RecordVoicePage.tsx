import { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import styles from "./RecordVoicePage.module.scss";
import { ReactComponent as Pause } from "./pause.svg";
import { ReactComponent as Play } from "./play.svg";
import { ReactComponent as Stop } from "./stop.svg";

export const RecordVoicePage = () => {
  const recognitionRef = useRef<SpeechRecognition>(null);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPause, setIsPause] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  const isActiveRef = useRef<boolean>(null);
  const isPauseRef = useRef<boolean>(null);
  const speechRef = useRef<string>('');

  useEffect(() => {
    isActiveRef.current = isActive;
    isPauseRef.current = isPause;
    speechRef.current = text;
  }, [isActive, isPause, text]);

  const initializeRecognition = useCallback(() => {
    if (!isActive) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.onstart = () => {
        setIsActive(true);
      }

      recognitionRef.current.onend = () => {
        if (isActiveRef.current && !isPauseRef.current) {
          recognitionRef.current?.start();
        }
      }

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(speechRef.current.concat(', ', transcript));
      }
    }

    recognitionRef.current?.start();
  }, [ isActive ]);

  const handleOnRecord = useCallback(() => {
    if (isPause) {
      setIsPause(false);
    }

    initializeRecognition();
  }, [ isPause, initializeRecognition ]);

  const handleOnPause = useCallback(() => {
    recognitionRef.current?.stop();
    setIsPause(true);
    setText(text + '\n');
  }, [ text ]);

  const handleOnStop = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setIsActive(false);
    setIsPause(false);
    setText('')
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: 1,
        }}
      >
        <Typography className={styles.speech} sx={{
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          overflowX: "hidden",
          textAlign: "left",
        }}>
          {text}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "35%",
          marginTop: 2,
        }}
      >
        <Button
          sx={{
            width: "40%",
            height: "100%",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            backgroundColor: "blue",
          }}
          onClick={!isActive || isPause ? handleOnRecord : handleOnPause}
        >
          {isActive && !isPause ? (
            <Pause className={styles.icon} />
          ) : (
            <Play className={styles.icon} />
          )}
        </Button>

        <Button
          sx={{
            width: "40%",
            height: "100%",
            borderRadius: "20px",
            backgroundColor: "red",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
          }}
          onClick={handleOnStop}
        >
          <Stop className={styles.icon} />
        </Button>
      </Box>
    </Box>
  );
};
