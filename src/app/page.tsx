/**
 * https://heroicons.com/solid
 *
 */

"use client";

import Download from "@/components/Download";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const inputUrlRef = useRef<HTMLInputElement>(null);
  const outputTranscriptRef = useRef(null);
  const transcribeButtonRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<Map<string, string>>(new Map());
  const audioPlayerRef = useRef(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    console.log("useEffect");
    if (typeof window !== "undefined") {
      workerRef.current = new Worker(
        new URL("../workers/transcriber.ts", import.meta.url)
      );

      workerRef.current.onmessage = handleWorkerMessage;

      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
        }
      };
    }
  }, []);

  function handleWorkerMessage(event: MessageEvent): void {
    const { type, data } = event.data;

    if (type === "model-loading") {
      setStatus(data);
    }
  }

  function handleTranscribeEvent(
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    event.preventDefault();

    if (!inputUrlRef.current) return;

    const url: string = inputUrlRef.current.value.trim();

    console.log(url);
  }

  function handleKeyDownEvent(
    event: React.KeyboardEvent<HTMLInputElement>
  ): void {
    if (event.key === "Enter") {
      event.preventDefault();
      if (transcribeButtonRef.current) {
        transcribeButtonRef.current.click();
      }
    }
  }

  return (
    <>
      <div className="m-10">
        <div className="m-4">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Real-time Audio Transcription
          </h1>

          <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            Enter the URL of an audio stream (e.g., an internet radio station)
            and click &quot;Transcribe&quot;. This app uses the
            `xenova/whisper-tiny.en` pre-trained model from Hugging Face and
            integrates Transformer.js in your browser via a Web Worker.
          </p>
        </div>

        <div className="m-4 flex gap-5 items-center">
          <label htmlFor="stream-url" className="sr-only">
            Stream URL
          </label>
          <input
            className="p-2 border-solid border-1 hover:border-blue-500 grow rounded-lg"
            type="url"
            ref={inputUrlRef}
            onKeyDown={handleKeyDownEvent}
            placeholder="Enter a stream URL"
          />
          <button
            className="border-none p-2 rounded-lg cursor-pointer disabled:cursor-not-allowed text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
            ref={transcribeButtonRef}
            onClick={handleTranscribeEvent}
          >
            Start Transcription
          </button>
        </div>

        <div className="m-4">
          <h2>Transcript</h2>
          <textarea
            className="border-solid border-1 p-2 w-full min-h-60 rounded-lg whitespace-pre-line break-all"
            ref={outputTranscriptRef}
          ></textarea>
        </div>

        <div className="m-4">
          <h2>Status</h2>
          <ul>
            {Array.from(status.entries()).map(([file, progress]) => (
              <li key={file}>
                <b>{file}</b>: {progress} <Download />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <audio ref={audioPlayerRef} crossOrigin="anonymous"></audio>
    </>
  );
}
