import type * as z from "zod";

export function isZodIssue(value: unknown): value is z.core.$ZodIssue {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    const v = value as Record<string, unknown>;
    return typeof v.message === "string" && typeof v.code === "string" && Array.isArray(v.path);
}

export function isZodIssueArray(value: unknown): value is z.ZodIssue {
    return Array.isArray(value) && value.every(isZodIssue);
}
