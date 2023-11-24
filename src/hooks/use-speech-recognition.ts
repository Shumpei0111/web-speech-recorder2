import { useState } from "react";

interface ISpeechRecognitionEvent {
  isTrusted?: boolean;
  results: {
    isFinal: boolean;
    [key: number]:
      | undefined
      | {
          transcript: string;
        };
  }[];
}

interface ISpeechRecognition extends EventTarget {
  // properties
  grammars: string;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;

  // event handlers
  onaudiostart: () => void;
  onaudioend: () => void;
  onend: () => void;
  onerror: () => void;
  onnomatch: () => void;
  onresult: (event: ISpeechRecognitionEvent) => void;
  onsoundstart: () => void;
  onsoundend: () => void;
  onspeechstart: () => void;
  onspeechend: () => void;
  onstart: () => void;

  // methods
  abort(): void;
  start(): void;
  stop(): void;
}

export default ISpeechRecognition;

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

interface IWindow extends Window {
  SpeechRecognition: ISpeechRecognitionConstructor;
  webkitSpeechRecognition: ISpeechRecognitionConstructor;
}

declare const window: IWindow;

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const SpeechRecognition =
    window.webkitSpeechRecognition || window.SpeechRecognition;

  const recognition = new SpeechRecognition();

  recognition.lang = "ja-JP";
  /* 音声認識システムが中間的な結果を返すか、最終的な結果だけを返すか定義します。 */
  recognition.interimResults = false; // 最終的な結果のみを返す
  /* 認識が開始されるたびに連続した結果をキャプチャする */
  recognition.continuous = true;

  const onStart = () => {
    recognition.start();
  };

  recognition.onresult = (event: ISpeechRecognitionEvent) => {
    recognition.stop();
    if (event.results[0].isFinal && event.results[0][0]) {
      setTranscript(event.results[0][0].transcript);
      console.log("transcript: ", transcript);
    }
  };

  recognition.onend = () => {
    console.log("onend");
    recognition.start();
  };

  return {
    onStart,
    transcript,
  };
};