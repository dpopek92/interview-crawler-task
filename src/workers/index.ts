import { Worker } from "worker_threads";
import { appState } from "../state";

export const initWorker = () => {
  const worker = new Worker("./dist/workers/fetcher.js");

  worker.on("message", (message) => {
    if (message.type === "update") {
      appState.updateState(message.stateData, message.mappingsData);
    }
  });
};
