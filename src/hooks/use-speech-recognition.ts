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
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const SpeechRecognition =
    window.webkitSpeechRecognition || window.SpeechRecognition;

  const recognition = new SpeechRecognition();

  recognition.lang = "ja-JP";
  /* 音声認識システムが中間的な結果を返す(true)か、最終的な結果だけを返す(false)か定義します。 */
  recognition.interimResults = true;
  /* 認識が開始されるたびに連続した結果をキャプチャする */
  recognition.continuous = true;

  const onStart = () => {
    recognition.start();
  };

  const onStop = () => {
    recognition.stop();
  };

  recognition.onresult = (event: ISpeechRecognitionEvent) => {
    if (event.results[0][0]) {
      event.results[0].isFinal
        ? setTranscripts([...transcripts, event.results[0][0].transcript])
        : setTranscript(event.results[0][0].transcript);
    }
  };

  return {
    onStart,
    onStop,
    transcript,
    transcripts,
  };
};
