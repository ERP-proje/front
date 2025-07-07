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
}

const MemberList = ({ selectedOption1 }: MemberListProps) => {
  const { fetchCustomer } = useCustomerStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const {
    showLoading,
    hideLoading,
    isFetched: globalIsFetched,
    setIsFetched,
  } = useLoadingStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetched: queryIsFetched,
  } = usePaginatedMembers(selectedOption1);

  const members: Member[] =
    (data as any)?.pages?.flatMap((page: { data: any }) => page.data) || [];
  useEffect(() => {
    if (queryIsFetched) {
      setIsFetched(true);
    }
    if (isLoading && !globalIsFetched) {
      console.log(
        "초기 로딩 시작: Global Loading ON (isFetched in store:",
        globalIsFetched,
        ")"
      );
      showLoading();
    } else {
      console.log(
        "로딩 완료 또는 재요청: Global Loading OFF (isFetched in store:",
        globalIsFetched,
        ")"
      );
      hideLoading();
    }
  }, [
    isLoading,
    queryIsFetched,
    globalIsFetched,
    showLoading,
    hideLoading,
    setIsFetched,
  ]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

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
    fetchCustomer(customerId);
    setSelectedCustomerId(customerId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerId(null);
  };

  return (
    <div className="grid grid-cols-1 rounded-xl gap-2 p-4 border border-gray-300 h-full overflow-y-auto">
      {(isLoading && !globalIsFetched) || isFetchingNextPage
        ? Array.from({ length: 6 }).map((_, i) => <MemberRowSkeleton key={i} />)
        : members.length > 0
        ? members.map((member) => (
            <MemberRow
              key={member.customerId}
              member={member}
              onClick={() => handleRowClick(member.customerId)}
            />
          ))
        : !isLoading &&
          !isFetchingNextPage && (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p>데이터가 없습니다.</p>
            </div>
          )}
      <div
        ref={observerRef}
        className="h-10 w-full flex justify-center items-center"
      >
        {isFetchingNextPage && (
          <span className="text-gray-500">다음 페이지 로딩 중...</span>
        )}
        {!hasNextPage &&
          !isLoading &&
          !isFetchingNextPage &&
          members.length > 0 && (
            <span className="text-gray-500">모든 데이터를 불러왔습니다.</span>
          )}
      </div>

      {isModalOpen && selectedCustomerId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative">
            <DetailMember
              customerId={selectedCustomerId}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;
