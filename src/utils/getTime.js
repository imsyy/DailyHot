import LunarCalendar from "lunar-calendar";

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;

  if (diffInSeconds < 60) {
    return "刚刚更新";
  } else if (diffInMinutes < 60) {
    const minutes = Math.floor(diffInMinutes);
    return `${minutes}分钟前更新`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours}小时前更新`;
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  }
};

export const getCurrentTime = () => {
  const time = new Date();
  const year = time.getFullYear();
  const month =
    time.getMonth() + 1 < 10
      ? "0" + (time.getMonth() + 1)
      : time.getMonth() + 1;
  const day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  const hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  const minute =
    time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  const second =
    time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
  const weekday = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  // 获取农历
  const lunar = LunarCalendar.solarToLunar(
    time.getFullYear(),
    time.getMonth() + 1,
    time.getDate()
  );
  const currentTime = {
    time: {
      year,
      month,
      day,
      hour,
      minute,
      second,
      weekday: weekday[time.getDay()],
      text:
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second,
    },
    lunar: {
      data: lunar,
      year: lunar.lunarYear,
      month: lunar.lunarMonthName,
      day: lunar.lunarDayName,
      GanZhiYear: lunar.GanZhiYear,
      GanZhiMonth: lunar.GanZhiMonth,
      GanZhiDay: lunar.GanZhiDay,
      text: lunar.lunarMonthName + lunar.lunarDayName,
    },
  };
  return currentTime;
};
