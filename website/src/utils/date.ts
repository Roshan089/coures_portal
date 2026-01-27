// utils/dateUtils.js
import dayjs from "dayjs";

const defaultFormat = "DD-MM-YYYY";

export const formatDate = (date: string, format = defaultFormat) => {
  return dayjs(date).format(format);
};

export const getYesterday = () => {
  return dayjs().subtract(1, "day").format(defaultFormat);
};

export const getTomorrow = () => {
  return dayjs().add(1, "day").format(defaultFormat);
};

export const isToday = (date: string) => {
  return dayjs(date).isSame(dayjs(), "day");
};
