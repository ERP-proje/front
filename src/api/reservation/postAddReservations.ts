import apiClient from "../core/apiClient";
import errorHandler from "../core/errorHandler";
import { timeMapping } from "@/utils/reservation/timeMapping";

export const postAddReservations = async (userInfo: {
  startStr: string;
  endStr: string;
  resourceId: number;
  memo: string;
  customerId: number;
  eventdate: string;
}) => {
  try {
    const response = await apiClient.post("/api/reservation/addReservation", {
      customerId: userInfo.customerId,
      reservationDate: userInfo.eventdate,
      startIndex: userInfo.startStr,
      endIndex: userInfo.endStr,
      resourceId: userInfo.resourceId,
      memo: userInfo.memo,
      seatNumber: userInfo.resourceId,
    });

    if (response.status === 200) {
      alert("예약이 성공적으로 완료되었습니다!");
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
