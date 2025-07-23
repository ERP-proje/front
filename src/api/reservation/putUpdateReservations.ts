import apiClient from "../core/apiClient";
import errorHandler from "../core/errorHandler";

export const putUpdateReservations = async (data: {
  reservationId: number;
  reservationDate: string;
  startIndex: number;
  endIndex: number;
  memo: string;
  seatNumber: number;
  attendanceStatus: string;
  progressList: {
    progressId: number;
    content: string;
  }[];
}) => {
  try {
    const response = await apiClient.put(
      "/api/reservation/updatedReservation",
      {
        reservationId: data.reservationId,
        reservationDate: data.reservationDate,
        startIndex: data.startIndex,
        endIndex: data.endIndex,
        memo: data.memo,
        seatNumber: data.seatNumber,
        attendanceStatus: data.attendanceStatus,
        progressList: data.progressList,
      }
    );
    if (response.status === 200) {
      alert("예약이 성공적으로 수정되었습니다!");
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
  } catch (error: unknown) {
    const errorMessage = errorHandler(error);
    throw new Error(errorMessage);
  }
};
