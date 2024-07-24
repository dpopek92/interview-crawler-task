import { parentPort } from "worker_threads";
import { getState, getMappings } from "../api";

const FETCH_INTERVAL = process.env.FETCH_INTERVAL
  ? +process.env.FETCH_INTERVAL
  : 1000;

const fetchAndEmitData = async () => {
  try {
    const stateData = await getState();
    const mappingsData = await getMappings();

    parentPort?.postMessage({ type: "update", stateData, mappingsData });
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
};

setInterval(fetchAndEmitData, FETCH_INTERVAL);
