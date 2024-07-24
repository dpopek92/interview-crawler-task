import axios from "axios";

const API_URL = process.env.API_URL;

export const getState = async (): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/api/state`);
    return response.data.odds;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getMappings = async (): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/api/mappings`, {
      headers: {
        "cache-control": "no-cache",
      },
    });
    return response.data.mappings;
  } catch (error) {
    console.error(error);
    return error;
  }
};
