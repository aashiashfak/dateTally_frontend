import {instance} from "@/utils/axios";
import { DateData } from "@/types";

export const fetchDateEntries = async (
  month: number,
  year: number
): Promise<DateData[]> => {
  const response = await instance.get<DateData[]>(`/dates/stored/`, {
    params: {
      year,
      month: month + 1, 
    },
  });
  return response.data;
};

export const updateDateEntry = async (
  date: string,
  count: number
): Promise<void> => {
  await instance.post("dates/add-date/", {date, count});
};