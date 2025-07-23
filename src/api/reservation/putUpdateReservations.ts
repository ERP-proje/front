import apiClient from "../core/apiClient";

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
