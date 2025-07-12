"use client";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import SideBar from "../components/SideBar";
import Reservation from "../components/reservation/Reservation";
import ReservationModal from "../components/reservation/reservationModal/ReservationModal";
import { SelectedEvent, SelectedRangeId } from "@/types/eventType";
import { adminAPI } from "@/api/admin/institute";
import { isNil } from "lodash";
import { instituteAPI } from "@/api/institute/instituteInfo";
export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<null | SelectedEvent>(
    null
  );
  const [selectedRangeId, setSelectedRangeId] =
    useState<SelectedRangeId | null>(null);

  const [startTime, setStartTime] = useState("08:00:00");
  const [endTime, setEndTime] = useState("22:00:00");
  const [instituteCount, setInstituteCount] = useState(4);

  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<Calendar>(null);

  console.log("selectedEvent", selectedEvent);
  console.log("selectedRangeId", selectedRangeId); // ✨ 새로운 상태를 콘솔에 출력

  useEffect(() => {
    const fetchInstituteData = async () => {
      try {
        const instituteData = await instituteAPI.getInstituteInfo();
        console.log("Fetched instituteData: ", instituteData);
        const totalSeats = instituteData.totalSeat;
        const startTime = instituteData.openTime;
        const endTime = instituteData.closeTime;
        setInstituteCount(totalSeats);
        setStartTime(startTime);
        setEndTime(endTime);
      } catch (error: any) {
        console.error("Error fetching institute data:", error);
      }
    };

    fetchInstituteData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SideBar */}
      <div className="h-full flex-[5_0_0]">
        <SideBar />
      </div>

      {/* Reservation */}
      <div className="h-full flex-[95_0_0] self-center mr-[130px] py-10 overflow-hidden">
        <Reservation
          startTime={startTime}
          endTime={endTime}
          totalSeats={instituteCount}
          setSelectedEvent={setSelectedEvent}
          calendarRef={calendarRef}
          calendarInstance={calendarInstance}
        />
      </div>

      {/* Reservation Modal */}
      <ReservationModal
        selectedEvent={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        calendarInstance={calendarInstance}
        // ✨ ReservationModal에도 필요하다면 selectedRangeId와 setter 함수를 전달
        setSelectedRangeId={setSelectedRangeId}
      />
    </div>
  );
}
