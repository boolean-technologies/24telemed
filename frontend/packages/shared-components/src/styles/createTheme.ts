import defaultsDeep from "lodash/defaultsDeep";
import type { PartialDeep } from "type-fest";

import { defaultTheme } from "./defaultTheme";
import type { Theme } from "./theme.types";

export function createTheme(themeOverride: PartialDeep<Theme> = {}): Theme {
  return defaultsDeep(themeOverride, defaultTheme);
}
