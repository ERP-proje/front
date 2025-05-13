"use client";

import { useEffect, useState } from "react";
import { getReservationByTime } from "@/api/reservation/getReservationByTime";
import transformNextTimeReservation from "@/utils/reservation/transformNextTimeReservation";
import dayjs from "dayjs";

export const useNextReservation = () => {
  const [nextReservation, setNextReservation] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const currentTime = dayjs();

  const nextStartTime = currentTime
    .add(1, "hour")
    .startOf("hour")
    .format("YYYY-MM-DDTHH:mm:ss");

  const nextEndTime = currentTime
    .add(1, "hour")
    .endOf("hour")
    .format("YYYY-MM-DDTHH:mm:ss");

  // Time for testing
  // const nextStartTime = "2024-12-02T10:00:00.000";
  // const nextEndTime = "2024-12-02T10:59:59.000";

  // console.log("currentTime", currentTime);
  // console.log("nextStart", nextStartTime);
  // console.log("nextEnd", nextEndTime);

  useEffect(() => {
    const loadNextTimeReservation = async () => {
      try {
        const response = await getReservationByTime(nextStartTime);
        console.log("API response fetchNextTimeReservations:", response);

        const transformedData = transformNextTimeReservation(
          nextStartTime,
          nextEndTime,
          response?.data || []
        );
        setNextReservation(transformedData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error("Error loading reservations:", err.message);
        }
      }
    };

    loadNextTimeReservation();
  }, [nextStartTime, nextEndTime]);

  return { nextReservation, error };
};
