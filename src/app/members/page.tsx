"use client";

import React, { useState } from "react";
import SideBar from "../components/SideBar";
import TopControls from "../components/member/list/TopControls";
import MemberList from "../components/member/list/MemberList";
import MemberRow from "../components/member/list/MemberRow";
import useCustomerStore from "@/store/useCustomerStore";
import DetailMember from "../components/member/detail/DetailMember";

export type option1Type = "ACTIVE" | "DELETED" | "INACTIVE";

export default function Page() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [filterOption1, setFilterOption1] = useState<option1Type>("ACTIVE");
  const { fetchCustomer } = useCustomerStore();
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (customerId: number) => {
    console.log("선택된 customerId:", customerId);
    fetchCustomer(customerId);
    setSelectedCustomerId(customerId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerId(null);
  };

  return (
    <div
      className="flex items-center h-screen"
      style={{
        fontSize: "clamp(0.875rem, 0.75rem + 0.5vw, 1rem)",
      }}
    >
      <div className="h-full">
        <SideBar />
      </div>
      <div className="relative h-[900px] flex-[8_0_0] bg-white rounded-xl p-4 max-w-[1500px] w-full">
        <TopControls
          setSearchResults={setSearchResults}
          setOption1={setFilterOption1}
        />
        <div className="relative h-[790px]">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 rounded-xl gap-2 p-4 border border-gray-300 h-full overflow-y-auto">
              {searchResults.map((member) => (
                <MemberRow
                  key={member.customerId}
                  member={member}
                  onClick={() => handleRowClick(member.customerId)}
                />
              ))}
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
          ) : (
            <MemberList selectedOption1={filterOption1} />
          )}
        </div>
      </div>
    </div>
  );
}
