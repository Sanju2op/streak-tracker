import { Platform } from "react-native";
import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const isWeb = Platform.OS === "web";

let expoDb: any = null;
let db: any = null;

if (isWeb) {
  console.warn(
    "Using in-memory DB fallback on web to avoid expo-sqlite sync timeouts. Data is not persisted in web mode.",
  );
  // Provide a dummy DB for the web so the app doesn't crash on startup
  expoDb = {
    execSync: () => {},
  };
  db = {
    select: () => ({
      from: () => ({
        where: () => Promise.resolve([]),
        then: (res: any) => Promise.resolve([]).then(res),
      }),
    }),
    insert: () => ({
      values: () => Promise.resolve([]),
    }),
    update: () => ({
      set: () => ({
        where: () => Promise.resolve([]),
      }),
    }),
    delete: () => ({
      where: () => Promise.resolve([]),
    }),
  } as any;
} else {
  expoDb = openDatabaseSync("streak-tracker.db");
  db = drizzle(expoDb, { schema });
}

export { expoDb, db };
