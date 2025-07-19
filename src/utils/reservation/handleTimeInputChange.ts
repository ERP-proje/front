export function handleTimeInputChange(
  inputValue: string,
  type: "start" | "end",
  setUserInfo: (updater: (prev: any) => any) => void,
  setTimeError: (msg: string) => void,
  setIsValid: (isValid: boolean) => void,
  setTime: (time: string) => void,
  isValid: boolean
) {
  setUserInfo((prev) => ({
    ...prev,
    [`formatted${type === "start" ? "Start" : "End"}Time`]: inputValue,
    seatNumber: prev.seatNumber,
  }));

  if (inputValue === "") {
    setTimeError("");
    return;
  }

  const isValidFormat = /^\d{2}:\d{2}$/.test(inputValue);
  if (!isValidFormat) {
    setTimeError("시간은 HH:MM 형식으로 입력해주세요");
    setIsValid(false);
    return;
  }

  const [hh, mm] = inputValue.split(":").map(Number);
  const isValidTime = hh >= 0 && hh <= 23 && (mm === 0 || mm === 30);

  if (!isValidTime) {
    setTimeError("시간은 30분 단위로만 입력 가능합니다");
    setIsValid(false);
    return;
  }

  setIsValid(true);
  setTimeError("");
  setTime(inputValue);
}
