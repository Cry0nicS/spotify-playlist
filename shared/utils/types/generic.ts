import type * as z from "zod";
// eslint-disable-next-line ts/consistent-type-imports -- z.infer<typeof Schema> requires Schema to be imported as a value
import {EnvVarsSchema} from "#shared/utils/schemas";

export type EnvVars = z.infer<typeof EnvVarsSchema>;
