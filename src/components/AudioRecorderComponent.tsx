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

    async function recStop() {
      if (audioRecorder) {
        await audioRecorder.recStop();
      }
    }
    // コンポーネントのアンマウント時にリソースをクリーンアップ
    return () => {
      // 必要に応じてクリーンアップのロジックをここに追加
      recStop();
    };
  }, []);

  // 録音開始
  const handleStartRecording = async () => {
    console.log("handleStartRecording");

    if (audioRecorder) {
      await audioRecorder.recStart();
    }
  };

  // 録音停止
  const handleStopRecording = async () => {
    console.log("handleStopRecording");
    console.log("has audioRecorder: ", !!audioRecorder);
    if (audioRecorder) {
      const recordedBlob = await audioRecorder.recStop();
      console.log("recordedBlob: ", recordedBlob);
      if (recordedBlob) {
        const url = URL.createObjectURL(recordedBlob);
        console.log("url: ", url);
        setAudioUrl(url);
      }
    }
  };

  return (
    <div className="max-w-600">
      <p>{new Date().toLocaleString()}</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          className="border-[#c1c1c1] rounded-md hover:border-[#d8d8d8] border-[1px]"
          onClick={handleStartRecording}
        >
          Start Recording
        </button>
        <button
          className="border-[#c1c1c1] rounded-md hover:border-[#d8d8d8] border-[1px]"
          onClick={handleStopRecording}
        >
          Stop Recording
        </button>
      </div>
      <p>audioURL: {audioUrl}</p>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
}

export default AudioRecorderComponent;
