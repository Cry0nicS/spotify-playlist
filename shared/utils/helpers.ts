import type {KnownHttpStatus} from "#shared/utils/types";
import {HTTP_STATUS_MESSAGES} from "#shared/utils/constants";

export function getHttpStatusMessage(code: number): string {
    return HTTP_STATUS_MESSAGES[code as KnownHttpStatus] ?? "Unexpected error";
}
