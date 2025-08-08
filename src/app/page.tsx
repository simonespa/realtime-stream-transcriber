'use client';

import { useRef, useEffect } from "react";

export default function Home() {
  const urlRef = useRef(null);
  const transcribeButtonRef = useRef(null);
  const statusRef = useRef(null);
  const transcriptRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      workerRef.current = new Worker(new URL('../workers/transformers.ts', import.meta.url));

      workerRef.current.onmessage = function (event) {
      };

      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
        }
      };
    }
  }, []);

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
            ref={urlRef}
            placeholder="Enter a stream URL"
          />
          <button ref={transcribeButtonRef}>Start Transcription</button>
        </div>

        <div ref={statusRef}>Status: Idle</div>

        <h2>Transcription</h2>

        <div id="transcript" ref={transcriptRef}></div>
      </div>

      <audio ref={audioPlayerRef} crossOrigin="anonymous"></audio>
    </>
  );
}
