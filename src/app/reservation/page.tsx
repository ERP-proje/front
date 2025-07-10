"use client";
import { useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import SideBar from "../components/SideBar";
import Reservation from "../components/reservation/Reservation";
import ReservationModal from "../components/reservation/reservationModal/ReservationModal";
import { SelectedEvent, SelectedRangeId } from "@/types/eventType";

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<null | SelectedEvent>(
    null
  );
  const [selectedRangeId, setSelectedRangeId] =
    useState<SelectedRangeId | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<Calendar>(null);

  console.log("selectedEvent", selectedEvent);
  console.log("selectedRangeId", selectedRangeId); // ✨ 새로운 상태를 콘솔에 출력

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SideBar */}
      <div className="h-full flex-[5_0_0]">
        <SideBar />
      </div>

      {/* Reservation */}
      <div className="h-full flex-[95_0_0] self-center mr-[130px] py-10 overflow-hidden">
        <Reservation
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
