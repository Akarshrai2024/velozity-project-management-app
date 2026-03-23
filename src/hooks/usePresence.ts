import { useState, useEffect, useRef } from 'react';
import { PresenceMap, Task, SimUser } from '../types';
import { SIM_USERS, PRESENCE_INTERVAL_MS } from '../data/constants';

export function usePresence(tasks: Task[]): PresenceMap {
  const [presenceMap, setPresenceMap] = useState<PresenceMap>({});
  const tasksRef = useRef<Task[]>(tasks);
  tasksRef.current = tasks;

  useEffect(() => {
    const assign = () => {
      const pool = tasksRef.current;
      if (pool.length === 0) return;

      const m: PresenceMap = {};
      const sample = pool.slice(0, Math.min(pool.length, 120));

      SIM_USERS.forEach((user: SimUser) => {
        const t = sample[Math.floor(Math.random() * sample.length)];
        if (t) {
          if (!m[t.id]) m[t.id] = [];
          m[t.id].push(user);
        }
      });

      setPresenceMap(m);
    };

    assign();
    const iv = setInterval(assign, PRESENCE_INTERVAL_MS);
    return () => clearInterval(iv);
  }, []);

  return presenceMap;
}

export function getActiveSimUsers(presenceMap: PresenceMap): SimUser[] {
  const seen = new Set<string>();
  const users: SimUser[] = [];
  Object.values(presenceMap)
    .flat()
    .forEach((u) => {
      if (!seen.has(u.id)) {
        seen.add(u.id);
        users.push(u);
      }
    });
  return users;
}