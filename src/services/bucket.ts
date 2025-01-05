import ky from "ky";

import { Bucket, FetchingData, PresignedUrl } from "@/lib/types";

import api from "./kyInstance";

export const getFile = async (id: string) => {
  return await (await api.get(`files/${id}`)).blob();
};

export const createPresignedURL = async (params: { name: string }) => {
  return (
    await api.post("files/presigned-url", { json: params }).json<FetchingData<PresignedUrl>>()
  ).data;
};

type BucketInfo = {
  id: string;
  name: string;
};

export const updatePresignedURL = async ({ id, name }: BucketInfo) => {
  return (
    await api
      .put(`files/presigned-url/${id}`, { json: { name } })
      .json<FetchingData<PresignedUrl>>()
  ).data;
};

export const confirmUpload = async (params: { id: string }) => {
  return (await api.post("files/confirmation", { json: params }).json<FetchingData<BucketInfo>>())
    .data;
};

export const deleteFile = async (id: string) => {
  return api.delete(`files/${id}`).json();
};

export const uploadFileToCloud = async ({ file, url }: { file: File; url: string }) => {
  const arrayBuffer = await file.arrayBuffer();
  const kyInstance = ky.create({});
  await kyInstance.put(url, { body: arrayBuffer, headers: { "Content-Type": file.type } });
};
