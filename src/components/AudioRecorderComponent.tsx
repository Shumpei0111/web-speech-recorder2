import { useState, useEffect } from "react";
import AudioRecordingModule from "../lib/record";

function AudioRecorderComponent() {
  const [audioRecorder, setAudioRecorder] =
    useState<AudioRecordingModule | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>();

  // コンポーネントのマウント時に AudioRecordingModule のインスタンスを作成
  useEffect(() => {
    const recorder = new AudioRecordingModule();
    setAudioRecorder(recorder);
    // コンポーネントのアンマウント時にリソースをクリーンアップ
    return () => {
      // 必要に応じてクリーンアップのロジックをここに追加
    };
  }, []);

  // 録音開始
  const handleStartRecording = async () => {
    if (audioRecorder) {
      await audioRecorder.recStart();
    }
  };

  // 録音停止
  const handleStopRecording = async () => {
    if (audioRecorder) {
      const recordedBlob = await audioRecorder.recStop();
      if (recordedBlob) {
        setAudioUrl(URL.createObjectURL(recordedBlob));
      }
    }
  };

  return (
    <div>
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>
      <p>audioURL: {audioUrl}</p>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
}

export default AudioRecorderComponent;
