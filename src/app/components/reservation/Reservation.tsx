"use client";
import React, { useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import { calendarSetup } from "@/utils/calendar/calendarSetup";
import MiniCalendarPopup from "./miniCalendar/MiniCalendarPopup";
import { loadReservation } from "@/api/reservation/loadReservation";
import dayjs from "dayjs";
import { SelectedEvent } from "@/types/eventType";

function Reservation({
  setSelectedEvent,
  calendarRef,
  calendarInstance,
  totalSeats,
  startTime,
  endTime,
}: {
  setSelectedEvent: React.Dispatch<React.SetStateAction<SelectedEvent | null>>;
  calendarRef: React.MutableRefObject<HTMLDivElement | null>;
  calendarInstance: React.MutableRefObject<Calendar | null>;
  totalSeats: number | null;
  startTime: string | null;
  endTime: string | null;
}) {
  const now = dayjs();
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const [clickedDate, setClickedDate] = useState<dayjs.Dayjs>(now);
  const nowDate = clickedDate?.format("YYYY-MM-DD");

  useEffect(() => {
    if (calendarRef.current && startTime && endTime && totalSeats) {
      const totalSeatsObj = Array.from({ length: totalSeats }, (_, i) => ({
        id: (i + 1).toString(),
        title: (i + 1).toString(),
      }));
      calendarInstance.current = calendarSetup({
        calendarRef,
        clickedDate,
        setClickedDate,
        setShowMiniCalendar,
        setSelectedEvent,
        now,
        startTime,
        endTime,
        totalSeatsObj,
      });
      console.log("in reservation.tsx");
      console.log(startTime, endTime, totalSeats);
      console.log(totalSeatsObj);
    }

    return () => {
      if (calendarInstance.current) {
        calendarInstance.current.destroy();
        calendarInstance.current = null;
      }
    };
  }, [
    calendarRef,
    calendarInstance,
    setSelectedEvent,
    startTime,
    endTime,
    totalSeats,
  ]);

  useEffect(() => {
    if (calendarInstance.current) {
      console.log("calendarInstance", calendarInstance.current);
      loadReservation(nowDate, calendarInstance);
    }
  }, [calendarInstance?.current, nowDate]);

  const handleMiniCalendarDateClick = (date: string) => {
    const selected = dayjs(date);
    setClickedDate(selected);
    setShowMiniCalendar(false);
    calendarInstance.current?.gotoDate(date);
  };

  return (
    <div className="h-full bg-white py-2 px-5 rounded-3xl ">
      <div ref={calendarRef} id="calendar" className="h-full" />

      {showMiniCalendar && (
        <MiniCalendarPopup onDateClick={handleMiniCalendarDateClick} />
      )}
    </div>
  );
}

export default Reservation;
