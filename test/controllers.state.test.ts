import { describe, it, expect, beforeEach, vi } from "vitest";
import { EventStatus, appState } from "../src/state";
import { getState } from "../src/controllers/state";

describe("getState", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {};
    res = {
      json: vi.fn(),
    };
  });

  it("should return state data excluding removed events", async () => {
    const mockState = {
      event1: {
        id: "event1",
        status: EventStatus.LIVE,
        scores: {},
        startTime: "2022-01-01T00:00:00.000Z",
        sport: "FOOTBALL",
        competitors: {
          HOME: { type: "HOME", name: "Team A" },
          AWAY: { type: "AWAY", name: "Team B" },
        },
        competition: "Competition 1",
      },
      event2: {
        id: "event2",
        status: EventStatus.REMOVED,
        scores: {},
        startTime: "2022-01-01T00:00:00.000Z",
        sport: "FOOTBALL",
        competitors: {
          HOME: { type: "HOME", name: "Team C" },
          AWAY: { type: "AWAY", name: "Team D" },
        },
        competition: "Competition 2",
      },
    };

    vi.spyOn(appState, "getState").mockReturnValue(mockState);

    await getState(req, res);

    expect(res.json).toHaveBeenCalledWith({
      event1: {
        id: "event1",
        status: EventStatus.LIVE,
        scores: {},
        startTime: "2022-01-01T00:00:00.000Z",
        sport: "FOOTBALL",
        competitors: {
          HOME: { type: "HOME", name: "Team A" },
          AWAY: { type: "AWAY", name: "Team B" },
        },
        competition: "Competition 1",
      },
    });
  });
});
