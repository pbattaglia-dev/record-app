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
        if (speechRef.current?.length > 0) {
          setText(speechRef.current.concat(', ', transcript));
        } else {
          setText(transcript);
        }
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
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <Box
        borderRadius={2}
        p={4}
        margin={1}
        className={styles.speechContainer}
      >
        <Typography className={styles.speech}>
          {text}
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="space-evenly"
        alignItems="center"
        height='35%'
        margin={1}
        gap={2}
      >
        <Button
          sx={{ backgroundColor: "#c7cee8" }}
          onClick={!isActive || isPause ? handleOnRecord : handleOnPause}
          className={styles.button}
        >
          {isActive && !isPause ? (
            <Pause className={styles.icon} />
          ) : (
            <Play className={styles.icon} />
          )}
        </Button>

        <Button
          sx={{ backgroundColor: "#bad1c6" }}
          onClick={handleOnStop}
          className={styles.button}
        >
          <Stop className={styles.icon} />
        </Button>
      </Box>
    </Box>
  );
};
