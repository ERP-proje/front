export default function loading() {
  return (
    <div className="text-center text-lg font-semibold text-gray-700">
      <p>회원 정보를 불러오는 중입니다...</p>
      <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}
