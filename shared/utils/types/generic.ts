import type {EnvVarsSchema} from "#shared/utils/schemas";
import type z from "zod";

export type EnvVars = z.infer<typeof EnvVarsSchema>;
