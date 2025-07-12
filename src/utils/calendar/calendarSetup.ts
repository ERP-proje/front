import { Calendar } from "@fullcalendar/core";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { CalendarSetupProps } from "@/types/eventType";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";

dayjs.extend(timezone);

dayjs.locale("ko");

export const calendarSetup = ({
  calendarRef,
  clickedDate,
  setClickedDate,
  setShowMiniCalendar,
  setSelectedEvent,
  now,
  startTime,
  endTime,
  totalSeatsObj,
}: CalendarSetupProps) => {
  if (!calendarRef.current) return null;

  const currentTime = now?.format("HH:mm:ss");
  console.log("clickedDate", clickedDate);

  const calendar = new Calendar(calendarRef.current, {
    // Set library plugins and initial View
    plugins: [resourceTimeGridPlugin, dayGridPlugin, interactionPlugin],
    initialView: "resourceTimeGridDay",
    slotMinTime: startTime,
    slotMaxTime: endTime,
    slotDuration: "00:30:00",
    scrollTime: currentTime,
    expandRows: true,

    // Set drag available
    selectable: true,

    timeZone: "local",
    allDaySlot: false,
    slotMinWidth: 5,
    height: "100%",
    slotEventOverlap: false,

    // Set calendar resources

    resources: totalSeatsObj,

    // Set event items
    events: [],
    eventTextColor: "#000000",

    // Set event click Callback
    eventClick: function (info) {
      const eventObj = info.event;
      console.log("eventObj", eventObj);
      setSelectedEvent({
        userName: eventObj?.title,
        startDate: eventObj?.start,
        endDate: eventObj?.end,
        startStr: eventObj?.startStr,
        endStr: eventObj?.endStr,
        seatNumber: Number(eventObj?.id),
        reservationId: eventObj.extendedProps?.reservationId,
        mode: "edit",
      });
    },

    // Set drag Callback
    select: function (info) {
      const resourceId = info.resource?.id;

      const newEvent = {
        startStr: dayjs(info.start).format("YYYY-MM-DDTHH:mm:ss"),
        endStr: dayjs(info.end).format("YYYY-MM-DDTHH:mm:ss"),
        formattedStartTime: dayjs(info.start).format("HH:mm"),
        formattedEndTime: dayjs(info.end).format("HH:mm"),
        resourceId,
        extendedProps: {
          seatNumber: resourceId,
        },
        mode: "add" as const,
      };
      setSelectedEvent(newEvent);
    },

    // default design setting
    nowIndicator: true,
    headerToolbar: {
      left: "",
      center: "prev, customTitle, next",
      right: "",
    },
    customButtons: {
      customTitle: {
        text: "",
        click: () => setShowMiniCalendar((prev) => !prev),
      },
    },

    // Set customTitle buttonx` based on currentDate
    datesSet: (info) => {
      const currentDate = dayjs(info.view.currentStart).tz("Asia/Seoul");

      const formatted = dayjs(currentDate).format("M월 D일 dddd");

      const customTitleButton = calendarRef.current?.querySelector(
        ".fc-customTitle-button.fc-button.fc-button-primary"
      );
      ``;
      if (formatted && customTitleButton && currentDate) {
        customTitleButton.textContent = formatted;
        setClickedDate(dayjs(currentDate));
      }
    },
  });

  calendar.render();
  return calendar;
};
