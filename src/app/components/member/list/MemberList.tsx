"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MemberRow from "./MemberRow";
import { Member } from "@/types/memberType";
// DetailMember 임포트는 MemberList에서 직접 모달을 띄우지 않는다면 필요 없습니다.
// import DetailMember from "../detail/DetailMember";
import useCustomerStore from "@/store/useCustomerStore";
import usePaginatedMembers from "@/hooks/member/usePaginatedMembers";
import MemberRowSkeleton from "./MemberRowSkeleton";
import { option1Type } from "@/app/members/page";
// MembersLoading 임포트도 MemberList에서 직접 렌더링하지 않는다면 필요 없습니다.
// import MembersLoading from "@/app/members/MembersLoading";

const MemberList = ({
  selectedOption1,
  setIsDataLoading,
}: {
  selectedOption1: option1Type;
  setIsDataLoading: (isLoading: boolean) => void;
}) => {
  const { fetchCustomer } = useCustomerStore();
  // ⚠️ 모달 관련 상태는 page.tsx에서 관리하는 것이 더 좋습니다.
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  // ✅ React Query 무한스크롤 데이터 가져오기
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePaginatedMembers(selectedOption1);

  // ✅ `data.pages`가 존재하는 경우 평탄화
  const members: Member[] =
    (data as any)?.pages?.flatMap((page: { data: any }) => page.data) || []; // ✅ pages에서 data만 추출

  // ✅ `fetchNextPage`를 `useCallback`으로 고정
  const loadMore = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  // ✅ 스크롤 이벤트 감지 (Intersection Observer)
  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(); // ✅ Intersection Observer에서 `loadMore` 호출
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  // ⚠️ `handleRowClick`은 `page.tsx`의 함수를 prop으로 받아 직접 호출하는 것이 좋습니다.
  // MemberList는 목록 렌더링에만 집중하고, 클릭 이벤트 처리는 부모에게 위임하세요.
  // 현재는 page.tsx에서 직접 onClick을 handleRowClick으로 연결하고 있으므로, 이 함수는 page.tsx의 handleRowClick을 직접 호출하게 됩니다.
  const handleRowClick = (customerId: number) => {
    console.log("MemberList에서 클릭된 customerId:", customerId);
    fetchCustomer(customerId); // Zustand에서 API 호출
    // ⚠️ 이 아래 두 줄은 page.tsx의 handleRowClick에서 처리됩니다.
    // setSelectedCustomerId(customerId);
    // setIsModalOpen(true);
  };

  // ✅ React Query의 isLoading 상태를 부모 컴포넌트로 전달합니다.
  useEffect(() => {
    setIsDataLoading(isLoading);
    console.log("MemberList 내부의 isLoading:", isLoading);
  }, [isLoading, setIsDataLoading]);

  return (
    <div className="grid grid-cols-1 rounded-xl gap-2 p-4 border border-gray-300 h-full overflow-y-auto">
      {isLoading && members.length === 0
        ? Array.from({ length: 6 }).map((_, i) => <MemberRowSkeleton key={i} />)
        : members.map((member) => (
            <MemberRow
              key={member.customerId}
              member={member}
              // `page.tsx`의 `handleRowClick`을 직접 사용하도록 합니다.
              onClick={() => handleRowClick(member.customerId)}
            />
          ))}

      {/* ✅ 무한스크롤 트리거 요소 (마지막 요소 감지) */}
      <div
        ref={observerRef}
        className="h-10 w-full flex justify-center items-center"
      >
        {isFetchingNextPage && hasNextPage && (
          <span className="text-gray-500">
            더 많은 회원 정보를 불러오는 중...
          </span>
        )}
      </div>
    </div>
  );
};

export default MemberList;
