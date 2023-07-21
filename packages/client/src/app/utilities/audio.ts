export interface AudioRecording {
  stream: MediaStream;
  recorder: MediaRecorder;
}

const reader = new FileReader();

export async function convertAudioBlobListToStringList(blobList: Blob[]) {
  return Promise.all(blobList.map((blob) => blob.text()));
}

export function convertStringListToAudioBlobList(stringList: string[]) {
  return stringList.map((text) => new Blob([text], { type: "audio/webm" }));
}

export function loadChunksIntoPlayer(
  chunks: Blob[],
  audioPlayer: HTMLAudioElement
) {
  const blob = new Blob(chunks, { type: "audio/webm" });
  const audioURL = URL.createObjectURL(blob);
  audioPlayer.src = audioURL;
}

export function startRecording(onStop: (chunks: Blob[]) => void) {
  return navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const audioRecording: AudioRecording = {
      stream,
      recorder: new MediaRecorder(stream),
    };

    const chunks: Blob[] = [];

    audioRecording.recorder.addEventListener("dataavailable", (e) => {
      chunks.push(e.data);
    });

    audioRecording.recorder.addEventListener("stop", () => {
      onStop(chunks);
    });

    audioRecording.recorder.start();

    return audioRecording;
  });
}

export function stopRecording({ stream, recorder }: AudioRecording) {
  recorder.stop();
  stream.getTracks().forEach(function (track) {
    track.stop();
  });
}

export function playRecording(audioPlayer: HTMLAudioElement) {
  audioPlayer.play();
}

export function stopPlaying(audioPlayer: HTMLAudioElement) {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
}

export function saveRecordingToLocalStorage(key: string, chunks: Blob[]) {
  window.localStorage.setItem(key, JSON.stringify(chunks));
}

export function loadRecordingFromLocalStorage(
  key: string,
  audioPlayer: HTMLAudioElement
) {
  const record = window.localStorage.getItem(key);

  if (!record) {
    return;
  }

  const chunks = JSON.parse(record) as Blob[];

  loadChunksIntoPlayer(chunks, audioPlayer);
}
