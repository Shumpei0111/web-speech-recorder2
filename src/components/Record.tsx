import { useState, useEffect } from "react";
import RecordRTC from "recordrtc";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";
import { Microphone } from "./icon/microphone";

type Recording = {
  audioURL: string;
  blob: Blob;
  id: string;
  recDate: string;
};

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const seconds = now.getSeconds();
  return `${year}/${month}/${date} ${hour}:${minute}:${seconds}`;
};

export const Record = () => {
  const [recorder, setRecorder] = useState<RecordRTC | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const { onStart, onStop, transcripts, transcript } = useSpeechRecognition();

  // 録音の開始
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const newRecorder = new RecordRTC(stream, { type: "audio" });
      newRecorder.startRecording();
      setRecorder(newRecorder);
      setIsRecording(true);

      onStart();
    } catch (err: any) {
      setError("録音の開始に失敗しました: " + err.message);
    }
  };

  // 録音の停止
  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        setIsRecording(false);

        onStop();

        const id =
          Math.random().toString(32).substring(2) +
          new Date().getTime().toString(32);

        const newRecording: Recording = {
          audioURL: URL.createObjectURL(blob),
          blob,
          id,
          recDate: getCurrentDate(),
        };

        setRecordings([...recordings, newRecording]);
      });
    }
  };

  // コンポーネントのアンマウント時にリソースを解放
  useEffect(() => {
    return () => {
      if (recorder) {
        recorder.destroy();
      }
    };
  }, [recorder]);

  return (
    <div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center bg-white z-50 w-375 pb-32 pt-10">
        <RecButton
          isRecording={isRecording}
          stopCallback={stopRecording}
          startCallback={startRecording}
        />
      </div>
      <section>
        <article className="flex flex-col gap-8">
          {recordings.map((recording) => (
            <div key={recording.id} className="border-b border-black-10 py-4">
              <div className="p-12">
                <audio src={recording.audioURL} controls />
                <p className="text-12 text-right pt-4">{recording.recDate}</p>
              </div>
            </div>
          ))}
        </article>
        {error && <p className="text-red text-12">エラー: {error}</p>}
        <article>
          {transcripts.map((transcriptItem, index) => (
            <div>
              <p key={index}>
                <span>{transcriptItem}</span>
                {isRecording && <span>{transcript}</span>}
              </p>
            </div>
          ))}
        </article>
      </section>
    </div>
  );
};

const RecButton = ({
  isRecording,
  stopCallback,
  startCallback,
}: {
  isRecording: boolean;
  stopCallback: () => void;
  startCallback: () => void;
}) => (
  <button
    className="rounded-full w-60 h-60 text-32 shadow-lg bg-red hover:bg-black-40 duration-300 transition"
    onClick={isRecording ? stopCallback : startCallback}
  >
    {isRecording ? "■" : <MicrophoneIcon />}
  </button>
);

const MicrophoneIcon = () => {
  return (
    <div className="text-white w-60 h-60 [&>svg]:w-30 [&>svg]:h-30 flex items-center justify-center">
      <Microphone />
    </div>
  );
};
