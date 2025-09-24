export default function getTimeDifference(fromTime: Date, toTime: Date) {
  function addTrailingZero(digit: number) {
    return `0${digit}`.slice(-2);
  }

  const difference = fromTime.getTime() - toTime.getTime();
  if (difference < 1000) return null;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${addTrailingZero(minutes)}:${addTrailingZero(seconds - minutes * 60)}`;
}
