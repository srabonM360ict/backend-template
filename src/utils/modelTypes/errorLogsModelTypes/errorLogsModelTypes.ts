import {
  ERROR_LEVEL_CRITICAL,
  ERROR_LEVEL_DEBUG,
  ERROR_LEVEL_ERROR,
  ERROR_LEVEL_INFO,
  ERROR_LEVEL_WARNING,
  SOURCE_EXHIBITOR,
  SOURCE_VISITOR,
} from "../../miscellaneous/constants";

export interface IInsertErrorLogsPayload {
  level:
    | typeof ERROR_LEVEL_DEBUG
    | typeof ERROR_LEVEL_INFO
    | typeof ERROR_LEVEL_WARNING
    | typeof ERROR_LEVEL_ERROR
    | typeof ERROR_LEVEL_CRITICAL;
  message: string;
  stack_trace?: string;
  source?: typeof SOURCE_EXHIBITOR | typeof SOURCE_VISITOR;

  user_id?: number;
  institute_id?: number;
  url: string;
  http_method: string;
  metadata?: {};
}

export interface IGetErrorLogsList {
  id: number;
  level:
    | typeof ERROR_LEVEL_DEBUG
    | typeof ERROR_LEVEL_INFO
    | typeof ERROR_LEVEL_WARNING
    | typeof ERROR_LEVEL_ERROR
    | typeof ERROR_LEVEL_CRITICAL;
  message: string;
  stack_trace: string | null;
  source: typeof SOURCE_EXHIBITOR | typeof SOURCE_VISITOR | null;
  user_id: number | null;
  url: string;
  http_method: string;
  metadata: {} | null;
  created_at: Date;
}

export interface IGetErrorLogsListFilterQuery {
  limit?: number;
  skip?: number;
  level?: string;
  search?: string;
}
