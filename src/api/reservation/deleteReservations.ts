import apiClient from "../core/apiClient";
import errorHandler from "../core/errorHandler";

export const deleteReservations = async (reservationId: number) => {
  try {
    const response = await apiClient.delete(
      `/api/reservation/deleteReservation/${reservationId}`
    );
    if (response.status === 200) {
      alert("삭제가 성공적으로 완료되었습니다!");
    }
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || "알 수 없는 오류가 발생했습니다.";

      if (status === 400) {
        alert(`잘못된 요청입니다: ${message}`);
      } else if (status === 401) {
        alert(`권한이 없습니다: ${message}`);
      } else if (status === 500) {
        alert(`서버 오류입니다: ${message}`);
      } else {
        alert(`오류가 발생했습니다 (${status}): ${message}`);
      }
    } else {
      alert("서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
    }
  }
};
