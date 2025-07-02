"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MemberRow from "./MemberRow";
import { Member } from "@/types/memberType";
import DetailMember from "../detail/DetailMember";
import useCustomerStore from "@/store/useCustomerStore";
import usePaginatedMembers from "@/hooks/member/usePaginatedMembers";
import MemberRowSkeleton from "./MemberRowSkeleton";
import { option1Type } from "@/app/members/page";
import { useLoadingStore } from "@/store/useLoadingStore";

interface MemberListProps {
  selectedOption1: option1Type;
  onDataLoaded: () => void;
}

const MemberList = ({ selectedOption1, onDataLoaded }: MemberListProps) => {
  const { fetchCustomer } = useCustomerStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );

  const { hideLoading } = useLoadingStore();

  // ✅ React Query 무한스크롤 데이터 가져오기
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePaginatedMembers(selectedOption1);

  useEffect(() => {
    if (!isLoading) {
      onDataLoaded();
    }
  }, [isLoading, onDataLoaded]);

  // ✅ `data.pages`가 존재하는 경우 평탄화
  const members: Member[] =
    (data as any)?.pages?.flatMap((page: { data: any }) => page.data) || []; // ✅ pages에서 data만 추출

  // ✅ `fetchNextPage`를 `useCallback`으로 고정
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      // ⚠️ 이미 다음 페이지를 가져오는 중이 아닐 때만 호출
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // ✅ 스크롤 이벤트 감지 (Intersection Observer)
  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

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

  return (
    <div className="grid grid-cols-1 rounded-xl gap-2 p-4 border border-gray-300 h-full overflow-y-auto">
      {/* ⚠️ 초기 로딩 시 스켈레톤 표시 */}
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => <MemberRowSkeleton key={i} />)
      ) : members.length > 0 ? ( // 데이터가 있을 때만 맵핑
        members.map((member) => (
          <MemberRow
            key={member.customerId}
            member={member}
            onClick={() => handleRowClick(member.customerId)}
          />
        ))
      ) : (
        // 데이터가 없을 때 표시할 내용
        <div className="flex justify-center items-center h-full text-gray-500">
          <p>데이터가 없습니다.</p>
        </div>
      )}
      {/* ✅ 무한스크롤 트리거 요소 (마지막 요소 감지) */}
      <div
        ref={observerRef}
        className="h-10 w-full flex justify-center items-center"
      >
        {isFetchingNextPage && ( // ⚠️ 다음 페이지를 가져오는 중일 때만 로딩 표시
          <span className="text-gray-500">다음 페이지 로딩 중...</span>
        )}
        {!hasNextPage &&
          !isLoading &&
          !isFetchingNextPage &&
          members.length > 0 && (
            <span className="text-gray-500">모든 데이터를 불러왔습니다.</span>
          )}
      </div>
      {/* 모달 */}
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
  );
};

export default MemberList;
