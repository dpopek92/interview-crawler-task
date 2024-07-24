import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getState, getMappings } from "../src/api";

describe("API functions", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should fetch state data correctly", async () => {
    const odds = "state_data";
    mock.onGet(`${process.env.API_URL}/api/state`).reply(200, { odds });

    const result = await getState();
    expect(result).toBe(odds);
  });

  it("should fetch mappings data correctly", async () => {
    const mappings = "mappings_data";
    mock.onGet(`${process.env.API_URL}/api/mappings`).reply(200, { mappings });

    const result = await getMappings();
    expect(result).toBe(mappings);
  });

  it("should set no-cache headers for mappings request", async () => {
    const mappings = "mappings_data";
    mock.onGet(`${process.env.API_URL}/api/mappings`).reply(200, { mappings });

    const result = await getMappings();
    const requestHeaders = mock.history.get[0].headers;

    expect(result).toBe(mappings);
    expect(requestHeaders?.["cache-control"]).toBe("no-cache");
  });
});
