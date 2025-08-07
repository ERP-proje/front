"use client";
import React, { useEffect } from "react";
import Dropdown from "../../ui/Dropdown";
import { FormData, FormErrors } from "@/types/memberType";
import Camera from "./Camera";
import { map } from "lodash";
import RealtimeDropdown from "../../ui/RealtimeDropdown";

export interface RegisterFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  formErrors?: FormErrors;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  setFormData,
  formErrors = {},
}) => {
  const handleInputChange = (key: keyof FormData, value: any) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };
  const handleCapture = (photoFile: File) => {
    setFormData((prevData) => ({ ...prevData, photoFile }));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex gap-6">
        <div className="flex flex-col items-center w-1/3">
          <Camera
            onCapture={(photoFile) => handleInputChange("photoFile", photoFile)}
          />
        </div>

        <div className="flex flex-col w-2/3 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">이름</label>
              <input
                type="text"
                placeholder="이름"
                className="input-content w-full mb-1"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                성별(필수)
              </label>
              <RealtimeDropdown
                options={[
                  { label: "여", value: "FEMALE" },
                  { label: "남", value: "MALE" },
                ]}
                placeholder="성별"
                value={formData.gender}
                className="w-full"
                onChange={(selectedValue) => {
                  handleInputChange(
                    "gender",
                    selectedValue as "MALE" | "FEMALE"
                  );
                }}
              />
              {formErrors.gender && (
                <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                생년월일(필수)
              </label>
              <input
                type="date"
                className="input-content w-full"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
              />
              {formErrors.birthDate && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.birthDate}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                전화번호
              </label>
              <input
                type="text"
                placeholder="-를 제외하고 입력해주세요"
                className="input-content w-full"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 나머지 입력 폼 */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">주소</label>
          <input
            type="text"
            placeholder="주소를 입력해주세요."
            className="input-content w-full"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">방문 경로</label>
          <textarea
            placeholder="방문 경로를 입력해주세요."
            className="input-content w-full"
            value={formData.visitPath}
            onChange={(e) => handleInputChange("visitPath", e.target.value)}
          ></textarea>
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">메모</label>
          <textarea
            placeholder="메모할 내용을 입력해주세요."
            className="input-content w-full"
            value={formData.memo}
            onChange={(e) => handleInputChange("memo", e.target.value)}
          ></textarea>
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">약관</label>
          <textarea
            placeholder="약관"
            className="input-content w-full"
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
