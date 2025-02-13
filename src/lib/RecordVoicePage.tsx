import { useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
//import styles from "./RecordVoicePage.module.scss";

export const RecordVoicePage = () => {
  const recognitionRef = useRef<SpeechRecognition>(null);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [text, setText] = useState<string>();

  //const isSpeechDetected = false;

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
    <Box mt={3} px={2}>
      <Box maxWidth="lg" borderRadius={2} overflow="hidden" mx="auto">
        <Box bgcolor="grey.800" p={2}>
          <Box display="grid" gridTemplateColumns={{ sm: '1fr 1fr' }} gap={2} maxWidth="lg" bgcolor="grey.200" borderRadius={2} p={2} mx="auto">
            <Box>
              <Button
                fullWidth
                variant="contained"
                color={isActive ? 'secondary' : 'primary'}
                onClick={handleOnRecord}
              >
                {isActive ? 'Stop' : 'Record'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box maxWidth="lg" mx="auto" mt={3}>
        <Typography variant="body1" mb={2}>
          Spoken Text: {text}
        </Typography>
      </Box>
    </Box>
  );
};
