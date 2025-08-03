import Image from "next/image";
import { Button } from "../../ui/button";

interface Props {
  mode: "add" | "edit";
  onClose: () => void;
}

export default function ReservationHeader({ mode, onClose }: Props) {
  return (
    <div className="flex justify-between items-center mb-2">
      {/* Modal title */}
      <div className="text-base sm:text-lg md:text-xl font-semibold">
        {mode === "add" ? "예약 추가" : "예약 수정"}
      </div>
      {/* Modal close button */}
      <Button
        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-1"
        onClick={onClose}
      >
        <Image
          src="/reservationModal/closeIcon.png"
          width={50}
          height={50}
          alt="closeIcon"
          className="w-full h-full object-contain"
        />
      </Button>
    </div>
  );
}
