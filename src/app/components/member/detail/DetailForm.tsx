"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "../../ui/Dropdown";
import Camera from "../create/Camera";
import type { CustomerDetailData } from "@/store/useCustomerStore";
import usePaginatedMembers from "@/hooks/member/usePaginatedMembers";
import { Member } from "@/types/memberType";

interface Progress {
  progressId: number | null;
  date: string;
  content: string;
  deleted?: boolean;
  usedTime: number;
}

interface DetailFormProps {
  customer: Partial<CustomerDetailData>;
  usedTime: number;
}

const DetailForm: React.FC<DetailFormProps> = ({ customer, usedTime }) => {
  if (!customer) {
    return <div>회원 정보를 불러오는 중...</div>;
  }

  const progressList = (customer.progressList || []) as Progress[];

  return (
    <div className="space-y-6 p-6">
      <div className="flex gap-8 items-start">
        <div className="flex flex-col items-center w-1/3">
          <Camera
            onCapture={() => {}}
            photoUrl={
              customer.photoFile
                ? URL.createObjectURL(customer.photoFile)
                : customer.photoUrl
            }
          />
        </div>

        <div className="w-2/3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">이름</label>
              <input
                type="text"
                className="input-content w-full"
                value={customer.name || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">성별</label>
              <input
                type="text"
                className="input-content w-full"
                value={customer.gender === "MALE" ? "남" : "여"}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                생년월일
              </label>
              <input
                type="date"
                className="input-content w-full"
                value={customer.birthDate || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                전화번호
              </label>
              <input
                type="text"
                className="input-content w-full"
                value={customer.phone || ""}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">주소</label>
        <input
          type="text"
          className="input-content w-full mb-4"
          value={customer.address || ""}
          readOnly
        />

        <label className="block text-sm text-gray-600 mb-1">방문 경로</label>
        <textarea
          className="input-content w-full"
          value={customer.visitPath || ""}
          readOnly
        ></textarea>

        <label className="block text-sm text-gray-600 mb-1 mt-4">메모</label>
        <textarea
          className="input-content w-full"
          value={customer.memo || ""}
          readOnly
        ></textarea>
      </div>

      {/* ✅ 진도표 출력 (읽기 전용) */}
      <div>
        <label className="w-full block text-sm text-gray-600 mb-1">
          진도표
        </label>
        <div className="relative">
          <table className="w-full border text-sm mt-2 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border">회차</th>
                <th className="border">날짜</th>
                <th className="border">내용</th>
                <th className="border p-2 text-center">사용 시간</th>
              </tr>
            </thead>
            <tbody>
              {progressList
                .filter((row) => !row.deleted)
                .map((row, index) => (
                  <tr key={row.progressId ?? `temp-${index}`}>
                    <td className="border text-center">
                      {progressList.length - index}
                    </td>
                    <td className="border text-center">{row.date || "-"}</td>
                    <td className="border text-left p-2">
                      {row.content || "-"}
                    </td>
                    <td
                      className="border text-center"
                      onClick={() => console.log()}
                    >
                      {usedTime != null ? `${usedTime}` : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailForm;
