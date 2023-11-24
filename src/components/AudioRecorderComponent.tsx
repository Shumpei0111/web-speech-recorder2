import { useState, useEffect } from "react";
import AudioRecordingModule from "../lib/record";

function AudioRecorderComponent() {
  const [audioRecorder, setAudioRecorder] =
    useState<AudioRecordingModule | null>(null);

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
      await audioRecorder.recStop();
    }
  };

  return (
    <div>
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>
    </div>
  );
}

export default AudioRecorderComponent;
