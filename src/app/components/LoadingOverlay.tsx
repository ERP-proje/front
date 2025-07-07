"use client";

import React from "react";
import { useLoadingStore } from "@/store/useLoadingStore";
import { RiLoader4Fill } from "react-icons/ri";

const LoadingOverlay: React.FC = () => {
  const { isLoading, isFetched } = useLoadingStore();

  console.log(
    "LoadingOverlay - isLoading:",
    isLoading,
    "isFetched:",
    isFetched
  );
  if (!isLoading || isFetched) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <div className="flex flex-col items-center text-white">
        <RiLoader4Fill className="animate-spin text-6xl" />{" "}
        <span className="mt-4 text-lg">로딩중입니다...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
