export interface RecentActivityParams {
  page?: number;
  pageSize?: number;
}

export const DEFAULT_RECENT_ACTIVITY_PARAMS: RecentActivityParams = {
  page: 1,
  pageSize: 10,
};
