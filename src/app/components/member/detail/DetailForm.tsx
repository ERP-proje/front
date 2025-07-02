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

  useEffect(() => {
    if (customer?.progressList) {
      setProgressList(customer.progressList);
    }
  }, [customer?.progressList]);

  const updateRow = (index: number, field: keyof Progress, value: string) => {
    const updatedList = progressList.map((item, i) =>
      i === index
        ? { ...item, [field]: field === "usedTime" ? +value : value }
        : item
    );
    setProgressList(updatedList);
    onModify({ progressList: updatedList });
  };

  // The deleteRow function remains unchanged as it was not part of the modification request.
  const deleteRow = (index: number) => {
    setProgressList((prevList) => {
      const updatedList = [...prevList];
      const isExisting = updatedList[index].progressId !== null;

      if (isExisting) {
        onModify({
          progressList: prevList.map((item, i) =>
            i === index ? { ...item, deleted: true } : item
          ),
        });
      } else {
        const filteredList = updatedList.filter((_, i) => i !== index);
        onModify({ progressList: filteredList });
      }

      return updatedList;
    });
  };

  if (!customer) return <div>회원 정보를 불러오는 중...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex gap-8 items-start">
        <div className="flex flex-col items-center w-1/3">
          <Camera
            onCapture={(file) => onModify({ photoFile: file })}
            photoUrl={
              customer.photoFile
                ? URL.createObjectURL(customer.photoFile)
                : customer.photoUrl ?? undefined // null or undefined면 빈 이미지로 처리됨
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
                  onModify({ gender: value === "MALE" ? "MALE" : "FEMALE" })
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
        <label className="block text-sm text-gray-600 mb-1">주소</label>
        <input
          type="text"
          className="input-content w-full mb-4"
          value={customer.address}
          onChange={(e) => onModify({ address: e.target.value })}
        />
        <label className="block text-sm text-gray-600 mb-1">방문 경로</label>
        <textarea
          className="input-content w-full mb-4"
          value={customer.visitPath}
          onChange={(e) => onModify({ visitPath: e.target.value })}
        />
        <label className="block text-sm text-gray-600 mb-1">메모</label>
        <textarea
          className="input-content w-full"
          value={customer.memo}
          onChange={(e) => onModify({ memo: e.target.value })}
        />
      </div>

      <div>
        <label className="w-full block text-sm text-gray-600 mb-1">
          진도표
        </label>
        <div className="relative">
          <table className="w-full border text-sm mt-2 border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="border w-12">회차</th>
                <th className="border w-40">날짜 선택</th>
                <th className="border w-64">내용</th>
                <th className="border w-24">사용 시간</th>
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
                    <td className="border p-1">
                      <input
                        type="date"
                        className="w-full h-8 text-sm px-2 py-1 box-border border border-gray-300 rounded"
                        value={row.date}
                        onChange={(e) =>
                          updateRow(index, "date", e.target.value)
                        }
                        disabled
                      />
                    </td>
                    <td className="border p-1">
                      <input
                        type="text"
                        className="w-full h-8 text-sm px-2 py-1 box-border border border-gray-300 rounded"
                        value={row.content}
                        onChange={(e) =>
                          updateRow(index, "content", e.target.value)
                        }
                      />
                    </td>
                    <td className="border text-center p-1">
                      <input
                        type="number"
                        className="w-full h-8 text-sm px-2 py-1 box-border border border-gray-300 rounded text-right"
                        value={row.usedTime}
                        onChange={(e) =>
                          updateRow(index, "usedTime", e.target.value)
                        }
                        disabled
                      />
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
