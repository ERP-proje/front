import apiClient from "@/api/core/apiClient";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Member } from "@/types/memberType";

interface MemberListResponse {
  data: Member[];
}

const fetchMemberList = async ({
  pageParam,
  status,
}: {
  pageParam: number | null;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
}): Promise<MemberListResponse> => {
  const response = await apiClient.get<MemberListResponse>(
    "/api/customer/getCustomers",
    {
      params: {
        status,
        ...(pageParam !== null ? { lastId: pageParam } : {}),
      },
    }
  );

  return response.data;
};

const usePaginatedMembers = (status: "ACTIVE" | "INACTIVE" | "DELETED") => {
  return useInfiniteQuery<
    MemberListResponse,
    Error,
    MemberListResponse,
    ["members", "status", typeof status],
    number | null
  >({
    queryKey: ["members", "status", status],
    queryFn: async ({ pageParam }) => fetchMemberList({ pageParam, status }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.data.length === 0) {
        return null;
      }
      if (lastPage.data.length < 20) {
        // 한 페이지당 20개 데이터 기준
        return null;
      }
      return lastPage.data[lastPage.data.length - 1].customerId;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export default usePaginatedMembers;
