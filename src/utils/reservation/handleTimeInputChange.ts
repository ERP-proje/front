export function handleTimeInputChange(
  inputValue: string,
  type: "start" | "end",
  setUserInfo: (updater: (prev: any) => any) => void,
  setTimeError: (msg: string) => void
) {
  setUserInfo((prev) => ({
    ...prev,
    [`formatted${type === "start" ? "Start" : "End"}Time`]: inputValue,
  }));

  if (inputValue === "") {
    setTimeError("");
    return;
  }

  const isValidFormat = /^\d{2}:\d{2}$/.test(inputValue);
  if (!isValidFormat) {
    setTimeError("시간은 HH:MM 형식으로 입력해주세요");
    return;
  }

  const [hh, mm] = inputValue.split(":").map(Number);

  if (hh < 0 || hh > 23 || (mm !== 0 && mm !== 30)) {
    setTimeError("시간은 30분 단위로만 입력 가능합니다");
    return;
  }

  setTimeError("");
}
