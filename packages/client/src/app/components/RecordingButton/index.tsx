import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AudioRecording,
  loadChunksIntoPlayer,
  playRecording,
  startRecording,
  stopPlaying,
  stopRecording,
} from "../../utilities/audio";

export interface RecordButtonProps {
  audioData: Blob[] | undefined;
  onUpdate: (audioData: Blob[] | undefined) => void;
}

export const RecordButton: React.FC<RecordButtonProps> = ({
  audioData,
  onUpdate,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const [audioRecording, setAudioRecording] = useState<AudioRecording | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const audioPlayer = audioPlayerRef.current;

  useEffect(() => {
    if (audioPlayer && audioData) {
      loadChunksIntoPlayer(audioData, audioPlayer);
    }
  }, [audioPlayer, audioData]);

  const onClickStartRecording = useCallback(async () => {
    const audioPlayer = audioPlayerRef.current;

    if (audioPlayer) {
      setIsRecording(true);
      setAudioRecording(
        await startRecording((chunks) => {
          onUpdate(chunks);
        })
      );
    }
  }, []);

  const onClickStopRecording = useCallback(() => {
    if (audioRecording) {
      setIsRecording(false);
      stopRecording(audioRecording);
    }
  }, [audioRecording]);

  const onClickPlayRecording = useCallback(() => {
    const audioPlayer = audioPlayerRef.current;

    if (audioPlayer) {
      playRecording(audioPlayer);
      setIsPlaying(true);
      audioPlayer.addEventListener("pause", () => {
        setIsPlaying(false);
      });
    }
  }, []);

  const onClickStopPlaying = useCallback(() => {
    const audioPlayer = audioPlayerRef.current;

    if (audioPlayer) {
      stopPlaying(audioPlayer);
      setIsPlaying(false);
    }
  }, []);

  return (
    <>
      <audio ref={audioPlayerRef}></audio>
      {isRecording ? (
        <button onClick={onClickStopRecording}>Stop</button>
      ) : (
        <button onClick={onClickStartRecording}>Start</button>
      )}
      {isPlaying ? (
        <button onClick={onClickStopPlaying}>Pause</button>
      ) : (
        <button
          onClick={onClickPlayRecording}
          disabled={!audioRecording || isRecording}
        >
          Play
        </button>
      )}
    </>
  );
};
