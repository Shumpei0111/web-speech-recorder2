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
  const { onStart, transcript } = useSpeechRecognition();

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
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "録音停止" : "録音開始"}
      </button>
      {/* {audioURL && <audio src={audioURL} controls />} */}
      {recordings.map((recording) => (
        <div key={recording.id}>
          <audio src={recording.audioURL} controls />
        </div>
      ))}
      {error && <p>エラー: {error}</p>}
      <p>{transcript}</p>
    </div>
  );
};
