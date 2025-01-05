import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  confirmUpload,
  createPresignedURL,
  getFile,
  updatePresignedURL,
  uploadFileToCloud,
} from "@/services/bucket";

export const bucketKeys = {
  key: ["bucket"] as const,
  list: () => bucketKeys.key,
};

export const useCreateBucket = () => {
  const { mutateAsync: mutatePresignedURL } = useMutation({
    mutationFn: (file: File) => createPresignedURL({ name: file.name }),
  });
  const { mutateAsync: mutateUploadFileToCloud } = useMutation({
    mutationFn: uploadFileToCloud,
  });
  return useMutation({
    mutationFn: async (file: File) => {
      const { id, url } = await mutatePresignedURL(file);
      await mutateUploadFileToCloud({ file, url });
      return confirmUpload({ id });
    },
  });
};

export const useUpdateBucket = () => {
  const { mutateAsync: mutatePresignedURL } = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      updatePresignedURL({ id, name: file.name }),
  });
  const { mutateAsync: mutateUploadFileToCloud } = useMutation({
    mutationFn: uploadFileToCloud,
  });
  return useMutation({
    mutationFn: async (data: { id: string; file: File }) => {
      const { id, file } = data;
      const { url } = await mutatePresignedURL(data);
      await mutateUploadFileToCloud({ file, url });
      return confirmUpload({ id });
    },
  });
};

export const useGetBucket = (
  id: string,
  options: Omit<UseQueryOptions<Blob>, "queryKey" | "queryFn">
) => {
  return useQuery<Blob>({
    ...options,
    queryKey: [...bucketKeys.key, id],
    queryFn: () => getFile(id),
  });
};
