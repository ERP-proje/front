import React from "react";
import MiniCalendar from "./MiniCalendar";

interface MiniCalendarPopupProps {
  onDateClick: (date: string) => void;
}

const MiniCalendarPopup: React.FC<MiniCalendarPopupProps> = ({
  onDateClick,
}) => (
  <div
    className="absolute top-[55px] z-[100]"
    onClick={(e) => e.stopPropagation()}
  >
    {" "}
    <MiniCalendar
      onDateClick={(date) => {
        onDateClick(date);
      }}
    />{" "}
  </div>
);

export default MiniCalendarPopup;
