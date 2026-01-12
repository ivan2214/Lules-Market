import * as schema from "../schema";
import { spreads } from "./utils";

export const models = {
  insert: spreads(schema, "insert"),
  select: spreads(schema, "select"),
} as const;
