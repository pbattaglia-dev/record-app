import { useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import styles from "./RecordVoicePage.module.scss";
import { ReactComponent as Pause } from "./pause.svg";
import { ReactComponent as Play } from "./play.svg";

export const RecordVoicePage = () => {
  const recognitionRef = useRef<SpeechRecognition>(null);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [text, setText] = useState<string>();

  function handleOnRecord() {
    if ( isActive ) {
      recognitionRef.current?.stop();
      setIsActive(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.onstart = function() {
      setIsActive(true);
    }

    recognitionRef.current.onend = function() {
      setIsActive(false);
    }

    recognitionRef.current.onresult = async function(event) {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    }

    recognitionRef.current.start();
  }

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
          onClick={handleOnRecord}
        >
          {isActive ? (
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
          }}
        >
        </Button>
      </Box>
    </Box>
  );
};
