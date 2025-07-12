import apiClient from "../core/apiClient";
import errorHandler from "../core/errorHandler";

export const instituteAPI = {
  /**
   * 매장 정보 조회 method
   * @return 매장 시작, 종료시간, 전체 좌석 수
   */
  getInstituteInfo: async () => {
    try {
      const response = await apiClient.get("/api/institute/info");
      return response.data.data; // 서버 응답의 `data` 필드에 리스트가 포함됨
    } catch (error: unknown) {
      const errorMessage = errorHandler(error);
      throw new Error(errorMessage);
    }
  },
};
