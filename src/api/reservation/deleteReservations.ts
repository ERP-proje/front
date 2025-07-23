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
    if (response.status === 400) {
      alert("400Error : 잘못된 요청입니다");
    }
    if (response.status === 401) {
      alert("401Error : 권한이 없는 사용자입니다");
    }
    if (response.status === 500) {
      alert("500Error : 담당자에게 문의해주세요");
    }
    return response.data;
  } catch (error: unknown) {
    const errorMessage = errorHandler(error);
    throw new Error(errorMessage);
  }
};
