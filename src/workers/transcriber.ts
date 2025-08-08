// Import the Transformers.js library
import { pipeline, env } from "@huggingface/transformers";

const map = new Map();

const pipe = await pipeline("automatic-speech-recognition", "xenova/whisper-tiny.en", {
  device: 'wasm',
  dtype: 'q8',
  progress_callback: (progress) => {
    if (progress.status !== 'ready') {
      if (progress.status === 'progress') {
        map.set(progress.file, progress.progress);
      } else {
        map.set(progress.file, progress.status);
      }
    }
    self.postMessage({
      type: 'model-loading',
      data: map
    });
  }
})
