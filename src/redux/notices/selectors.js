export const selectNotices = (state) => state.notices?.items || [];
export const selectTotalPages = (state) => state.notices?.totalPages || 1;
export const selectIsLoading = (state) => state.notices?.isLoading || false;
export const selectError = (state) => state.notices?.error || null;