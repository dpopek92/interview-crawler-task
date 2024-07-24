import { describe, it, expect, beforeEach } from "vitest";
import { AppState, EventStatus, SportEvent } from "../src/state";

describe("AppState", () => {
  let appState: AppState;

  beforeEach(() => {
    appState = new AppState();
  });

  it("should initialize with an empty state", () => {
    expect(appState.getState()).toEqual({});
  });

  it("should parse mappings correctly", () => {
    const mappingsData = "id1:value1;id2:value2";
    const expectedMappings = { id1: "value1", id2: "value2" };

    const mappings = appState["parseMappings"](mappingsData);

    expect(mappings).toEqual(expectedMappings);
  });

  it("should parse state data correctly", () => {
    const stateData =
      "event1,football,competition1,1620000000000,home1,away1,live,period1@1:0|period2@0:1";
    const mappingsData =
      "event1:Event 1;football:FOOTBALL;competition1:Competition 1;home1:Home Team;away1:Away Team;live:LIVE;period1:Period 1;period2:Period 2";
    const mappings = appState["parseMappings"](mappingsData);

    const expectedEvents: SportEvent[] = [
      {
        id: "event1",
        status: EventStatus.LIVE,
        scores: {
          CURRENT: { type: "CURRENT", home: "0", away: "0" },
          "Period 1": { type: "Period 1", home: "1", away: "0" },
          "Period 2": { type: "Period 2", home: "0", away: "1" },
        },
        startTime: new Date(1620000000000).toISOString(),
        sport: "FOOTBALL",
        competitors: {
          HOME: { type: "HOME", name: "Home Team" },
          AWAY: { type: "AWAY", name: "Away Team" },
        },
        competition: "Competition 1",
      },
    ];

    const events = appState.parseStateData(stateData, mappings);

    expect(events).toEqual(expectedEvents);
  });

  it("should update state correctly", () => {
    const stateData =
      "event1,football,competition1,1620000000000,home1,away1,live,period1@1:0|period2@0:1";
    const mappingsData =
      "event1:Event 1;football:FOOTBALL;competition1:Competition 1;home1:Home Team;away1:Away Team;live:LIVE;period1:Period 1;period2:Period 2";

    appState.updateState(stateData, mappingsData);

    const expectedState = {
      event1: {
        id: "event1",
        status: EventStatus.LIVE,
        scores: {
          CURRENT: { type: "CURRENT", home: "0", away: "0" },
          "Period 1": { type: "Period 1", home: "1", away: "0" },
          "Period 2": { type: "Period 2", home: "0", away: "1" },
        },
        startTime: new Date(1620000000000).toISOString(),
        sport: "FOOTBALL",
        competitors: {
          HOME: { type: "HOME", name: "Home Team" },
          AWAY: { type: "AWAY", name: "Away Team" },
        },
        competition: "Competition 1",
      },
    };

    expect(appState.getState()).toEqual(expectedState);
  });

  it("should handle missing or invalid data gracefully", () => {
    const stateData = "event1,football,competition1,,home1,away1,live,";
    const mappingsData =
      "event1:Event 1;football:FOOTBALL;competition1:Competition 1;home1:Home Team;away1:Away Team;live:LIVE";

    appState.updateState(stateData, mappingsData);

    const expectedState = {
      event1: {
        id: "event1",
        status: EventStatus.LIVE,
        scores: {
          CURRENT: { type: "CURRENT", home: "0", away: "0" },
        },
        startTime: "-",
        sport: "FOOTBALL",
        competitors: {
          HOME: { type: "HOME", name: "Home Team" },
          AWAY: { type: "AWAY", name: "Away Team" },
        },
        competition: "Competition 1",
      },
    };

    expect(appState.getState()).toEqual(expectedState);
  });
});
