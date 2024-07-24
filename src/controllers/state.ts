import { appState, EventStatus } from "../state";

export const getState = async (req, res) => {
  const stateData = Object.entries(appState.getState())
    .filter(([, value]) => value.status !== EventStatus.REMOVED)
    .reduce((acc, [key, value]) => {
      return { ...acc, [key]: value };
    }, {});

  res.json(stateData);
};
