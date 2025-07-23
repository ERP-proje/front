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
