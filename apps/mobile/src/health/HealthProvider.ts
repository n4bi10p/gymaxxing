export interface HealthSnapshot {
  steps: number | null;
  sleepHours: number | null;
}

export interface HealthProvider {
  isAvailable(): Promise<boolean>;
  readToday(): Promise<HealthSnapshot>;
}

export const unavailableHealth: HealthProvider = {
  async isAvailable() {
    return false;
  },
  async readToday() {
    return { steps: null, sleepHours: null };
  },
};
