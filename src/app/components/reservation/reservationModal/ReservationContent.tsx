import Image from "next/image";
import { handleTimeInputChange } from "@/utils/reservation/handleTimeInputChange";
import { putUpdateReservations } from "@/api/reservation/putUpdateReservations";
import { useEffect, useState } from "react";
import _ from "lodash";

interface Props {
  userInfo: any;
  setUserInfo: any;
  event: any;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  isSearching: boolean;
  customerList: any[];
  handleSearch: (keyword: string) => void;
  handleSelectCustomer: (customer: any) => void;
  handleInputChange: (field: string, value: string) => void;
  handleAddIcon: () => void;
  handleEditProgress: (progress: any) => void;
  handleDeleteProgress: (progress: {
    progressId?: number;
    date: string;
    content: string;
  }) => void;
  setStartTime: (startTime: string) => void;
  setEndTime: (endTime: string) => void;
}

export default function ReservationContent({
  userInfo,
  setUserInfo,
  event,
  searchKeyword,
  isSearching,
  customerList,
  handleSearch,
  handleSelectCustomer,
  handleInputChange,
  handleEditProgress,
  setStartTime,
  setEndTime,
}: Props) {
  const [timeError, setTimeError] = useState("");
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    console.log("isValid : ", isValid);
  }, [isValid, setIsValid]);
  useEffect(() => {
    setStartTime(userInfo?.formattedStartTime);
    setEndTime(userInfo?.formattedEndTime);
  }, []);
  return (
    // Main container: Ensure minimal padding and allow wrapping.
    // Changed md:flex-row to sm:flex-row for an earlier horizontal layout, if desired.
    // Added min-w-0 to the main flex container to allow it to shrink.
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start w-full min-w-0 mx-auto p-2">
      {/* Left column: User photo and Basic Info */}
      {/* Ensure this column can shrink as well if needed. */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-[1.6] min-w-0">
        {/* User photo */}
        <div className="justify-center mx-auto sm:m-1 size-24 sm:size-32 flex-shrink-0">
          <Image
            src={userInfo?.photoUrl || "/reservationModal/noUser.png"}
            alt="User Photo"
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* basic info */}
        {/* Changed md:max-w-[250px] to just max-w-full on smaller screens, and let flex-grow handle it. */}
        <div className="flex flex-col mx-2 w-full max-h-[600px] overflow-y-auto space-y-2 text-sm md:text-base flex-1 min-w-0">
          <div className="flex justify-between text-left m-1 font-semibold text-base md:text-lg">
            예약 시간
          </div>
          <div className="flex flex-row gap-1 w-full">
            <input
              className="flex-1 font-light bg-[#F2F8ED] border border-[#B4D89C] p-[8px_12px] rounded-lg text-[#3C6229] min-h-7 min-w-0 text-sm md:text-base"
              type="text"
              maxLength={5}
              value={userInfo?.formattedStartTime || ""}
              placeholder="--:--"
              onChange={(e) => {
                handleTimeInputChange(
                  e.target.value,
                  "start",
                  setUserInfo,
                  setTimeError,
                  setIsValid,
                  setStartTime,
                  isValid
                );
              }}
            />
            <div className="font-light p-2 min-h-7 text-sm md:text-base flex-shrink-0">
              ~
            </div>
            <input
              className="flex-1 font-light bg-[#F2F8ED] border border-[#B4D89C] p-[8px_12px] rounded-lg text-[#3C6229] min-h-7 min-w-0 text-sm md:text-base"
              type="text"
              maxLength={5}
              value={userInfo?.formattedEndTime || ""}
              placeholder="--:--"
              onChange={(e) =>
                handleTimeInputChange(
                  e.target.value,
                  "end",
                  setUserInfo,
                  setTimeError,
                  setIsValid,
                  setEndTime,
                  isValid
                )
              }
            />
          </div>
          {timeError && (
            <div className="text-red-500 text-xs md:text-sm mt-1">
              {timeError}
            </div>
          )}

          <div className="text-left m-1 font-semibold text-base md:text-lg">
            성함
          </div>
          <input
            className="w-full font-light bg-[#F2F8ED] p-[8px_12px] rounded-lg border border-[#B4D89C] text-[#3C6229] min-h-7 text-sm md:text-base"
            type="search"
            value={event?.mode === "add" ? searchKeyword : userInfo?.name}
            onChange={(e) => handleSearch(e.target.value)}
            readOnly={event?.mode === "edit"}
          />

          {isSearching && (
            <div className="p-2 text-gray-500 text-sm md:text-base">
              검색 중...
            </div>
          )}
          {searchKeyword && customerList.length > 0 && (
            <div className="bg-white border border-gray-300 rounded-lg mt-2 max-h-40 overflow-y-auto">
              {customerList.map((customer) => (
                <div
                  key={customer.customerId}
                  className="p-2 hover:bg-[#F2F8ED] cursor-pointer text-sm md:text-base"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  {customer.name}
                </div>
              ))}
            </div>
          )}

          <div className="text-left m-1 font-semibold text-base md:text-lg">
            전화번호
          </div>
          <input
            className="w-full font-light bg-[#F6F6F6] border border-[#D1D1D1] p-[8px_12px] rounded-lg text-[#888888] min-h-7 text-sm md:text-base"
            value={userInfo?.phone || ""}
            type="tel"
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />

          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="flex-1 text-left m-1 font-semibold justify-around text-base md:text-lg">
                이벤트 종료 기간
              </div>
              <div className="flex-1 text-left m-1 font-semibold justify-around text-base md:text-lg">
                남은 기간
              </div>
            </div>
            <div className="flex flex-row gap-1 w-full">
              {" "}
              {/* Added w-full */}
              <div className="flex-1 font-light bg-[#F6F6F6] border border-[#D1D1D1] p-[8px_12px] rounded-lg text-[#888888] min-h-7 min-w-0 text-sm md:text-base">
                {userInfo?.endDate?.split("T")[0] || ""}
              </div>
              <div className="flex-1 font-light bg-[#F6F6F6] border border-[#D1D1D1] p-[8px_12px] rounded-lg text-[#888888] min-h-7 min-w-0 text-sm md:text-base">
                {userInfo?.remainingTime || ""}
              </div>
            </div>
          </div>

          <div className="text-left m-1 font-semibold text-base md:text-lg">
            이용권
          </div>
          <div className="w-full font-light bg-[#F6F6F6] p-[8px_12px] rounded-lg border border-[#D1D1D1] text-[#888888] min-h-7 text-sm md:text-base">
            {userInfo?.planName || ""}
          </div>
          {event?.mode === "edit" && (
            <div>
              <div className="text-left m-1 font-semibold text-base md:text-lg">
                지각/결석
              </div>
              <div className="flex flex-row">
                <Image
                  src={
                    userInfo?.attendanceStatus === "LATE"
                      ? "/reservationModal/checked.png"
                      : "/reservationModal/unchecked.png"
                  }
                  alt="late"
                  width={100}
                  height={100}
                  className="flex self-center size-4 sm:size-5 flex-shrink-0"
                  onClick={() =>
                    setUserInfo((prev: any) => ({
                      ...prev,
                      attendanceStatus:
                        prev.attendanceStatus === "LATE" ? "NORMAL" : "LATE",
                    }))
                  }
                />
                <div className="flex-1 font-light p-2 min-h-7 text-sm md:text-base">
                  지각
                </div>
                <Image
                  src={
                    userInfo?.attendanceStatus === "ABSENT"
                      ? "/reservationModal/checked.png"
                      : "/reservationModal/unchecked.png"
                  }
                  alt="absent"
                  width={100}
                  height={100}
                  className="flex self-center size-4 sm:size-5 flex-shrink-0"
                  onClick={() =>
                    setUserInfo((prev: any) => ({
                      ...prev,
                      attendanceStatus:
                        prev.attendanceStatus === "ABSENT"
                          ? "NORMAL"
                          : "ABSENT",
                    }))
                  }
                />
                <div className="flex-1 font-light p-2 min-h-7 text-sm md:text-base">
                  결석
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right column: Member Memo and Progress List */}
      {/* Changed md:w-[320px] to flex-1 and min-w-0 to allow it to shrink. */}
      <div className="flex flex-col gap-4 w-full flex-1 min-w-0">
        <div className="w-full">
          <div className="text-left m-1 font-semibold text-base md:text-lg">
            회원 메모
          </div>
          <textarea
            className={`mt-2 w-full h-[100px] rounded-lg p-[8px_12px] resize-none transition-colors text-sm md:text-base ${
              userInfo?.memo
                ? "bg-[#F2F8ED] border border-[#B4D89C] text-[#3C6229]"
                : "bg-white border border-[#D1D1D1] text-gray-700"
            }`}
            placeholder="회원 관련 메모를 입력하세요"
            value={userInfo?.memo || ""}
            onChange={(e) => handleInputChange("memo", e.target.value)}
          />
        </div>

        <div>
          <div className="text-left m-1 font-semibold text-base md:text-lg">
            진도표
          </div>
          <div className="mt-2 w-full rounded-lg border border-[#D1D1D1] bg-white px-2 py-2 overflow-y-auto max-h-[250px] min-h-[180px]">
            {userInfo?.progressList?.filter((p: any) => !p.deleted).length >
            0 ? (
              userInfo.progressList
                .filter((p: any) => !p.deleted)
                .map((p: any) => (
                  <div
                    key={`${p.progressId}-${p.date}`}
                    className="w-full h-[53px] mb-2 px-[10px] py-[8px] rounded-lg flex justify-between items-start
           border border-[#D1D1D1] hover:border-[#B4D89C] hover:border-2 transition-all duration-150 cursor-pointer"
                    onClick={() => handleEditProgress(p)}
                  >
                    <div className="flex flex-col justify-start">
                      <div className="text-[#888888] font-semibold text-[11px] md:text-[12px] leading-[120%] mb-[4px]">
                        {new Date(p.date).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          weekday: "short",
                        })}
                      </div>
                      <div className="text-[13px] md:text-[14px] text-black leading-[130%]">
                        {p.content || "내용 없음"}
                      </div>
                    </div>

                    {p.usedTime && (
                      <div className="text-black text-[13px] md:text-[14px] font-normal font-['Inter'] leading-[120%]">
                        {p.usedTime.toString().replace(/\.0$/, "")}H
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="text-gray-400 text-sm md:text-base">
                진도 내역이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
