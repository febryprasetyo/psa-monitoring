import { axiosInstance } from "@/lib/axiosInstance";
import axios, { AxiosResponse } from "axios";

export const getDeviceTableList = async (accessToken: string) => {
  const res = await axiosInstance.post<DeviceTableResponse>(
    `api/mqtt/machine/list`,
    {
      limit: 1000,
      offset: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  return res.data;
};

type AddDeviceRequest = {
  id_mesin: string;
  dinas_id: number;
};

type AddDeviceResponse = MutateDataResponse | undefined;

export const addDeviceList = async (
  data: AddDeviceRequest,
  accessToken: string,
): Promise<AddDeviceResponse> => {
  try {
    const res: AxiosResponse<MutateDataResponse> = await axiosInstance.post(
      `/api/mqtt/machine/add`,
      {
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
  }
};
export const editDeviceList = async (
  id: string | number,
  data: AddDeviceRequest,
  accessToken: string,
): Promise<AddDeviceResponse> => {
  try {
    const res: AxiosResponse<MutateDataResponse> = await axiosInstance.post(
      `/api/mqtt/machine/update`,
      {
        id: id || "",
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
  }
};

export const DeleteDeviceList = async (
  id_mesin: string | number,
  accessToken: string,
) => {
  try {
    const res: AxiosResponse<MutateDataResponse> = await axiosInstance.post(
      `/api/mqtt/machine/remove`,
      {
        id_mesin: id_mesin,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
  }
};
