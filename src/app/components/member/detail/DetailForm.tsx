"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "../../ui/Dropdown";
import Camera from "../create/Camera";
import { FaTrashAlt } from "react-icons/fa";
import type {
  CustomerDetailData,
  UpdateCustomerDetail,
} from "@/store/useCustomerStore";

interface Progress {
  progressId: number | null;
  date: string;
  content: string;
  deleted?: boolean;
  usedTime: number;
}

interface DetailFormProps {
  customer: Partial<CustomerDetailData>;
  onModify: (
    updatedData: Partial<CustomerDetailData & UpdateCustomerDetail>
  ) => void;
}
const DetailForm: React.FC<DetailFormProps> = ({ customer, onModify }) => {
  const [progressList, setProgressList] = useState<Progress[]>([
    { progressId: null, date: "", content: "", usedTime: 0 },
  ]);

  // ✅ 고객 데이터 변경 시, 진도 리스트도 업데이트
  useEffect(() => {
    if (customer?.progressList) {
      setProgressList(customer.progressList);
    }
  }, [customer?.progressList]);

  if (!customer) {
    return <div>회원 정보를 불러오는 중...</div>;
  }

  // ✅ 신규 진도 추가

  // ✅ 진도 내용 수정
  const updateRow = (index: number, field: keyof Progress, value: string) => {
    const updatedList = progressList.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setProgressList(updatedList);
    onModify({ progressList: updatedList });
  };

  // ✅ 진도 삭제
  const deleteRow = (index: number) => {
    setProgressList((prevList) => {
      // const updatedList = prevList.filter((_, i) => i !== index);

      const updatedList = [...prevList];

      // 서버에 `deleted: true`를 보내야 하는 경우 (progressId가 존재하는 기존 진도)
      const isExistingProgress = prevList[index].progressId !== null;

      if (isExistingProgress) {
        onModify({
          progressList: prevList.map((item, i) =>
            i === index ? { ...item, deleted: true } : item
          ),
        });
      } else {
        const updatedList = prevList.filter((_, i) => i !== index);
        onModify({ progressList: updatedList });
      }

      return updatedList;
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex gap-8 items-start">
        <div className="flex flex-col items-center w-1/3">
          <Camera
            onCapture={(file) => onModify({ photoFile: file })}
            photoUrl={
              customer.photoFile
                ? URL.createObjectURL(customer.photoFile)
                : customer.photoUrl
            }
          />
        </div>

        {/* 오른쪽: 입력 폼 */}
        <div className="w-2/3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">이름</label>
              <input
                type="text"
                className="input-content w-full"
                value={customer.name}
                onChange={(e) => onModify({ name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">성별</label>
              <Dropdown
                options={[
                  { label: "여", value: "FEMALE" },
                  { label: "남", value: "MALE" },
                ]}
                defaultValue={customer.gender}
                onChange={(value) =>
                  onModify({
                    gender: value === "MALE" ? "MALE" : "FEMALE",
                  })
                }
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
                onChange={(e) => onModify({ birthDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                전화번호
              </label>
              <input
                type="text"
                className="input-content w-full"
                value={customer.phone}
                onChange={(e) => onModify({ phone: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">주소</label>
          <input
            type="text"
            className="input-content w-full mb-4"
            value={customer.address}
            onChange={(e) => onModify({ address: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">방문 경로</label>
          <textarea
            className="input-content w-full"
            value={customer.visitPath}
            onChange={(e) => onModify({ visitPath: e.target.value })}
          ></textarea>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">메모</label>
          <textarea
            className="input-content w-full"
            value={customer.memo}
            onChange={(e) => onModify({ memo: e.target.value })}
          ></textarea>
        </div>
      </div>
      {/* ✅ 진도표 */}
      <div>
        <label className="w-full block text-sm text-gray-600 mb-1">
          진도표
        </label>
        <div className="relative">
          <table className="w-full border text-sm mt-2 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border">회차</th>
                <th className="border">날짜 선택</th>
                <th className="border">내용</th>
                <th className="border p-2 text-center">사용 시간</th>
              </tr>
            </thead>
            <tbody>
              {progressList
                .filter((row) => !row.deleted) // 삭제된 진도 숨김
                .map((row, index) => (
                  <tr key={row.progressId ?? `temp-${index}`}>
                    <td className="border text-center">
                      {progressList.length - index}
                    </td>
                    <td className="border">{row.date}</td>
                    <td className="border p-0">{row.content}</td>
                    <td className="border text-center">{row.usedTime}H</td>
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
