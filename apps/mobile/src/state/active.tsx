import { useQuery } from '@powersync/react-native';
import { createContext, useContext, type ReactNode } from 'react';

interface ActiveWorkout {
  id: string;
  name: string;
  startedAt: string;
}

const ActiveContext = createContext<ActiveWorkout | null>(null);

export function ActiveWorkoutProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery<{ id: string; name: string; started_at: string }>(
    'select id, name, started_at from workouts where ended_at is null and deleted_at is null order by started_at desc limit 1',
  );
  const row = data[0];
  const value = row ? { id: row.id, name: row.name, startedAt: row.started_at } : null;
  return <ActiveContext.Provider value={value}>{children}</ActiveContext.Provider>;
}

export function useActiveWorkout(): ActiveWorkout | null {
  return useContext(ActiveContext);
}
