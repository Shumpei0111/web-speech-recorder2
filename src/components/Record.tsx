import { useState, useEffect } from "react";
import RecordRTC from "recordrtc";

export const Record = () => {
  const [recorder, setRecorder] = useState<RecordRTC | null>(null);
  const [audioURL, setAudioURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err: any) {
      setError("録音の開始に失敗しました: " + err.message);
    }
  };

  // 録音の停止
  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        setAudioURL(URL.createObjectURL(blob));
        setIsRecording(false);
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
      {audioURL && <audio src={audioURL} controls />}
      {error && <p>エラー: {error}</p>}
    </div>
  );
};
