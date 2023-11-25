import { useState, useEffect } from "react";
import RecordRTC from "recordrtc";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";

type Recording = {
  audioURL: string;
  blob: Blob;
  id: string;
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
      <div className="fixed bottom-40 left-1/2 -translate-x-1/2">
        <RecButton
          isRecording={isRecording}
          stopCallback={stopRecording}
          startCallback={startRecording}
        />
      </div>
      <section className="px-16">
        <article className="flex flex-col gap-8">
          {recordings.map((recording) => (
            <div key={recording.id}>
              <audio src={recording.audioURL} controls />
            </div>
          ))}
        </article>
        {error && <p className="text-red text-12">エラー: {error}</p>}
        {transcripts.map((transcript, index) => (
          <p key={index}>{transcript}</p>
        ))}
        {transcript && <p>{transcript}</p>}
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
    className="rounded-full w-60 h-60 text-32 shadow-md bg-red hover:bg-black-20 duration-300 transition"
    onClick={isRecording ? stopCallback : startCallback}
  >
    {isRecording ? "■" : "▶︎"}
  </button>
);
