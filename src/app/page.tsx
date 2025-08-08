'use client';

import { useRef, useEffect } from "react";

export default function Home() {
  const inputUrlRef = useRef<HTMLInputElement>(null);
  const outputTranscriptRef = useRef(null);
  const transcribeButtonRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      workerRef.current = new Worker(new URL('../workers/transcriber.ts', import.meta.url));

      workerRef.current.onmessage = function (event) {
      };

      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
        }
      };
    }
  }, []);

  const transcribeButtonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!inputUrlRef.current) return;

    const url: string = inputUrlRef.current.value.trim();

    console.log(url)
  };

  function keyDownHandler(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      event.preventDefault();
      if (transcribeButtonRef.current) {
        transcribeButtonRef.current.click();
      }
    }
  }

  return (
    <>
      <div id="container">
        <h1>Real-time Audio Transcription</h1>
        <p>
          Enter the URL of an audio stream (e.g., an internet radio station) and
          click &quot;Transcribe&quot;. This app uses the
          `xenova/whisper-tiny.en` pre-trained model from Hugging Face and integrates
          Transformer.js in your browser via a Web Worker.
        </p>

        <div id="controls">
          <input
            type="url"
            ref={inputUrlRef}
            onKeyDown={keyDownHandler}
            placeholder="Enter a stream URL"
          />
          <button ref={transcribeButtonRef} onClick={transcribeButtonHandler}>Start Transcription</button>
        </div>

        <div ref={statusRef}>Status: Idle</div>

        <h2>Transcription</h2>

        <div id="transcript" ref={outputTranscriptRef}></div>
      </div>

      <audio ref={audioPlayerRef} crossOrigin="anonymous"></audio>
    </>
  );
}
