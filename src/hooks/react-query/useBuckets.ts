import { useMutation } from "@tanstack/react-query";

import {
  confirmUpload,
  createPresignedURL,
  updatePresignedURL,
  uploadFileToCloud,
} from "@/services/bucket";

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
