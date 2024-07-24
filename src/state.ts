interface Competitor {
  type: string;
  name: string;
}

interface Score {
  type: string;
  home: string;
  away: string;
}

export enum EventStatus {
  PRE = "PRE",
  LIVE = "LIVE",
  REMOVED = "REMOVED",
}

export interface SportEvent {
  id: string;
  status: EventStatus;
  scores: { [key: string]: Score };
  startTime: string;
  sport: string;
  competitors: { [key: string]: Competitor };
  competition: string;
}

export class AppState {
  private internalState: { [key: string]: SportEvent } = {};

  public getState() {
    return this.internalState;
  }

  public updateState(stateData: string, mappingsData: string): void {
    try {
      const mappings = this.parseMappings(mappingsData);
      const events = this.parseStateData(stateData, mappings);

      // Clear previous state
      for (const id in this.internalState) {
        this.internalState[id].status = EventStatus.REMOVED;
      }

      // Update with new state
      for (const event of events) {
        this.internalState[event.id] = event;
      }
    } catch (error) {
      console.error("Error parsing state data:", error);
      return;
    }
  }

  private parseMappings(mappingsData: string): { [key: string]: string } {
    const mappings: { [key: string]: string } = {};
    const pairs = mappingsData.split(";");
    for (const pair of pairs) {
      const [id, value] = pair.split(":");
      mappings[id] = value;
    }
    return mappings;
  }

  public parseStateData(
    stateData: string,
    mappings: { [key: string]: string }
  ): SportEvent[] {
    const events: SportEvent[] = [];
    const rows = stateData.split("\n");

    for (const row of rows) {
      const columns = row.split(",");

      const event: SportEvent = {
        id: columns[0],
        status: EventStatus[mappings[columns[6]]],
        scores: {
          CURRENT: {
            type: "CURRENT",
            home: "0",
            away: "0",
          },
        },
        startTime: columns[3]
          ? new Date(parseInt(columns[3]))?.toISOString()
          : "-",
        sport: mappings[columns[1]],
        competitors: {
          HOME: {
            type: "HOME",
            name: mappings[columns[4]],
          },
          AWAY: {
            type: "AWAY",
            name: mappings[columns[5]],
          },
        },
        competition: mappings[columns[2]],
      };

      const scores = columns[7]?.split("|") || [];
      for (const score of scores) {
        const [period, result] = score?.split("@");
        if (!period || !result) break;

        const [home, away] = result.split(":");

        event.scores[mappings[period]] = {
          type: mappings[period],
          home: home,
          away: away,
        };
      }

      events.push(event);
    }
    return events;
  }
}

export const appState = new AppState();
