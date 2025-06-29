"use client";

import React, { useEffect, useState, useRef } from "react";
import SideBar from "../components/SideBar";
import TopControls from "../components/member/list/TopControls";
import MemberList from "../components/member/list/MemberList";
import MemberRow from "../components/member/list/MemberRow";
import useCustomerStore from "@/store/useCustomerStore";
import DetailMember from "../components/member/detail/DetailMember";

export type option1Type = "ACTIVE" | "DELETED" | "INACTIVE";

export default function Page() {
  const [searchResults, setSearchResults] = useState<any[]>([]); // 검색 결과 상태
  const [filterOption1, setFilterOption1] = useState<option1Type>("ACTIVE");
  const { fetchCustomer } = useCustomerStore();
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ✅ isDataLoading의 초기값을 true로 설정합니다.
  // 이렇게 해야 처음 페이지가 로드될 때 로딩 화면이 먼저 보입니다.
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  // useRef로 최신 isDataLoading 값 저장 (디버깅 목적이 아니라면 필수는 아닙니다)
  const isDataLoadingRef = useRef(isDataLoading);

  // isDataLoading 상태가 바뀔 때마다 ref 업데이트 (디버깅 목적이 아니라면 필수는 아닙니다)
  useEffect(() => {
    isDataLoadingRef.current = isDataLoading;
  }, [isDataLoading]);

  const handleRowClick = (customerId: number) => {
    console.log("선택된 customerId:", customerId);
    fetchCustomer(customerId); // Zustand에서 API 호출
    setSelectedCustomerId(customerId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerId(null); // 모달 닫기 시 초기화
  };

  useEffect(() => {
    console.log("상위에서 받은 isDataLoading의 값 : ", isDataLoading);
  }, [isDataLoading]);

  return (
    <div className="flex items-center h-screen">
      <div className="h-full">
        <SideBar />
      </div>
      {/* 메인 콘텐츠 영역 */}
      <div className="relative h-[900px] flex-[8_0_0] bg-white rounded-xl p-4 max-w-[1500px] w-full">
        <TopControls
          setSearchResults={setSearchResults}
          setOption1={setFilterOption1}
        />

        {/* ✅ isDataLoading 상태에 따른 조건부 렌더링 로직 시작 */}
        {
          <div className="relative h-[790px]">
            {/* 검색 결과가 있을 경우 */}
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 rounded-xl gap-2 p-4 border border-gray-300 h-full overflow-y-auto">
                {searchResults.map((member, index) => (
                  <MemberRow
                    key={member.customerId || index}
                    member={member}
                    onClick={() => handleRowClick(member.customerId)}
                  />
                ))}
                {/* 모달 (검색 결과용) */}
                {isModalOpen && selectedCustomerId && (
                  <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative">
                        <DetailMember
                          customerId={selectedCustomerId}
                          onClose={closeModal}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // 검색 결과가 없을 경우, 일반 회원 목록을 보여줍니다.
              <MemberList
                selectedOption1={filterOption1}
                setIsDataLoading={setIsDataLoading} // ✅ setIsDataLoading 함수를 MemberList에 전달
              />
            )}
          </div>
        }
        {/* ✅ 조건부 렌더링 로직 끝 */}
      </div>
    </div>
  );
}
