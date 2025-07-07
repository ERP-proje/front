"use client";

import React, { useState, useCallback, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Dropdown, { DropdownOption } from "../../ui/Dropdown";
import CreateMember from "../create/CreateMember";
import { memberAPI } from "@/api/member";
import debounce from "lodash/debounce";
import { FormData } from "@/types/memberType";
import RealtimeDropdown from "../../ui/RealtimeDropdown";
import { useLoadingStore } from "@/store/useLoadingStore"; // useLoadingStore 임포트

const TopControls = ({
  setSearchResults,
  setOption1,
}: {
  setSearchResults: any;
  setOption1: any;
}) => {
  const [keyword, setKeyword] = useState("");
  const { showLoading } = useLoadingStore(); // showLoading 함수 가져오기

  // FormData 상태는 CreateMember 컴포넌트와 관련이 깊으므로 TopControls에서는 제거하거나,
  // CreateMember로 완전히 위임하는 것을 고려해볼 수 있습니다.
  // 여기서는 사용되지 않으므로 일단 그대로 둡니다.
  const [formData, setFormData] = useState<FormData>({
    planId: 0,
    photoUrl: "string",
    name: "",
    gender: "MALE",
    phone: "",
    address: "",
    visitPath: "",
    birthDate: "",
    memo: "",
    photoFile: null,
    planPayment: {
      paymentsMethod: "CARD",
      registrationAt: "",
      discountRate: 0,
      status: false,
      licenseType: "",
      planType: "",
      courseType: "",
      planPrice: 0,
      planName: "",
      discountName: "",
      discountPrice: 0,
      otherPaymentMethod: "",
    },
    otherPayment: [
      {
        paymentsMethod: null,
        otherPaymentMethod: "",
        registrationAt: "",
        content: "",
        price: 0,
        status: false,
      },
    ],
  });

  // 디바운싱된 검색 함수
  const debouncedSearch = useCallback(
    debounce(async (searchKeyword: string) => {
      try {
        if (!searchKeyword.trim()) {
          setSearchResults([]); // 검색어가 없으면 결과 초기화
          return;
        }
        showLoading(); // 검색 시작 시 로딩 시작
        const response = await memberAPI.searchCustomerName(searchKeyword);
        setSearchResults(response.data || []); // 결과 데이터를 부모 컴포넌트로 전달
        // 검색 완료 후, MemberList가 마운트/업데이트되지 않고 검색 결과만 표시되는 경우
        // 여기서 hideLoading을 호출해야 할 수 있습니다.
        // 현재 로직에서는 searchResults가 변경되면 Page.tsx에서 MemberList 대신 검색 결과가 표시되므로,
        // 이 경우 hideLoading()은 Page.tsx나 MemberList에 위임하는 것이 더 좋습니다.
        // 또는 검색 결과 표시 여부에 따라 로딩 상태를 관리하는 로직이 필요합니다.
        // 일단 여기서는 필터 변경에 초점을 맞춥니다.
      } catch (error) {
        console.error("검색 오류:", error);
      } finally {
        // 검색 완료 후 로딩 상태를 확실히 숨김 (검색 결과만 표시되는 경우)
        // 만약 검색 결과가 MemberList를 완전히 대체한다면 필요합니다.
        // hideLoading(); // 검색 완료 시 로딩 숨김 (단, MemberList와 로딩 상태가 분리될 때)
      }
    }, 500),
    [setSearchResults, showLoading] // showLoading을 의존성 배열에 추가
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // ✅ 언마운트 시 debounce 취소
    };
  }, [debouncedSearch]); // debouncedSearch 의존성 추가

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  const sortingOptions: DropdownOption[] = [
    { label: "최신순", value: "latest" },
    { label: "이용 시간이 많은 순", value: "most_used" },
    { label: "이용 시간이 적은 순", value: "least_used" },
  ];

  const memberStatusOptions: DropdownOption[] = [
    { label: "이용 가능 회원 조회", value: "ACTIVE" },
    { label: "만료된 회원 조회", value: "INACTIVE" },
    { label: "삭제된 회원 조회", value: "DELETED" },
    // "전체 회원 조회"는 "ACTIVE"와 중복될 수 있으므로, 정확한 value 정의가 필요할 수 있습니다.
    // 예를 들어, 'ALL'과 같이 새로운 값을 정의하거나, 백엔드 API가 모든 상태를 반환하도록 합니다.
    { label: "전체 회원 조회", value: "ACTIVE" }, // 현재 이 부분은 selectedOption1 타입에 'ALL'이 없으므로 조정이 필요합니다.
  ];

  return (
    <div className="flex items-center mb-4 h-16 bg-[#f6f6f6] p-4 rounded-lg shadow">
      {/* 검색 */}
      <div className="relative flex-1 max-w-sm">
        <input
          type="text"
          placeholder="회원 검색"
          value={keyword}
          onChange={handleSearchChange}
          className="input-content"
        />
        <FiSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      <Dropdown
        options={sortingOptions}
        placeholder="정렬 기준 선택"
        defaultValue=""
        className="ml-4 w-[180px]"
        // 이 드롭다운의 onChange도 로딩 상태에 영향을 줄 수 있다면 showLoading을 추가합니다.
        // 예: onChange={(selectedValue) => { showLoading(); /* 정렬 로직 */ }}
      />

      <RealtimeDropdown
        options={memberStatusOptions}
        placeholder="회원 상태 선택" // 플레이스홀더를 더 명확하게 변경
        onChange={(selectedValue) => {
          // 중요: 필터 옵션 변경 시 로딩 시작
          showLoading();
          // `selectedValue`를 `option1Type`에 맞게 형변환합니다.
          // 현재 `memberStatusOptions`의 마지막 항목 `value: "ACTIVE"`가
          // "전체 회원 조회"를 나타낸다면 백엔드와 맞추어 `ALL` 등으로 변경하는 것이 좋습니다.
          // 임시로, "전체 회원 조회"를 선택했을 때도 "ACTIVE"로 필터링되게 합니다.
          const newOption1 = selectedValue as "ACTIVE" | "DELETED" | "INACTIVE"; // `option1Type`에 맞게 캐스팅

          setOption1(newOption1); // 부모 컴포넌트에 필터 옵션 전달
          setSearchResults([]); // 필터 변경 시 검색 결과 초기화 (MemberList가 다시 보이도록)
        }}
        className="ml-4 w-[200px]"
      />

      <div className="ml-auto">
        <CreateMember formData={formData} setFormData={setFormData} />
      </div>
    </div>
  );
};
export default TopControls;
