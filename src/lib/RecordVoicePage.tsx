import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import styles from "./RecordVoicePage.module.scss";
import { ReactComponent as Pause } from "./pause.svg";
import { ReactComponent as Play } from "./play.svg";
import { ReactComponent as Stop } from "./stop.svg";
import { useDeviceTypes } from '../hooks';
import clsx from "clsx";

export const RecordVoicePage = () => {
  const { matchesMobile } = useDeviceTypes();

  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPause, setIsPause] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  const recognitionRef = useRef<SpeechRecognition>(null);
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
        if (speechRef.current?.length > 0 && speechRef.current?.slice(-1) !== '\n') {
          setText(speechRef.current.concat(', ', transcript));
        } else if (speechRef.current?.length > 0) {
          setText(speechRef.current + transcript);
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

    if (isFirstTime) {
      setIsFirstTime(false);
    }

    initializeRecognition();
  }, [ isPause, initializeRecognition, isFirstTime ]);

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

  const PrimaryIcon = useMemo(() => {
    return isActive && !isPause ? Pause : Play;
  }, [isActive, isPause]);

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
        {isFirstTime && (
          <Typography className={styles.hint}>
            {"Click on the play icon to start recording your voice.\n\nClick on the pause icon to pause the recording.\n\nClick on the stop icon to stop the recording."}
          </Typography>
        )}

        <Typography className={styles.speech}>
          {text}
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="space-evenly"
        alignItems="center"
        height={matchesMobile ? '15%' : '35%'}
        marginInline={1}
        mb={1}
        gap={matchesMobile ? 1 : 2}
      >
        <Button
          sx={{
            backgroundColor: "#c7cee8",
            borderRadius: matchesMobile ? "8px" : "20px",
          }}
          onClick={!isActive || isPause ? handleOnRecord : handleOnPause}
          className={styles.button}
        >
          <PrimaryIcon className={clsx(styles.icon, { [styles.small]: matchesMobile })} />
        </Button>

        <Button
          sx={{
            backgroundColor: "#bad1c6",
            borderRadius: matchesMobile ? "8px" : "20px",
          }}
          onClick={handleOnStop}
          className={styles.button}
        >
          <Stop className={clsx(styles.icon, { [styles.small]: matchesMobile })} />
        </Button>
      </Box>
    </Box>
  );
};
