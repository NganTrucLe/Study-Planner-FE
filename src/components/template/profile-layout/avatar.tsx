import { useQueryClient } from "@tanstack/react-query";
import { Camera } from "lucide-react";

import ChangeImageDialog from "@/components/organisms/change-image-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { bucketKeys, useCreateBucket, useUpdateBucket } from "@/hooks/react-query/useBuckets";
import { useUserAvatar, useUserProfile } from "@/hooks/react-query/useUsers";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Avatar() {
  const { data: user } = useUserProfile();
  const { avatar, isLoading } = useUserAvatar();
  const updateBucket = useUpdateBucket();
  const createBucket = useCreateBucket();
  const queryClient = useQueryClient();

  if (isLoading) {
    return <Skeleton className="size-32 rounded-full border-4 border-white" />;
  }

  const handleChangeImage = (files: File[]) => {
    const file: File = files[0];
    if (user?.avatarId) {
      updateBucket.mutate(
        {
          id: user.avatarId,
          file,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: bucketKeys.key,
            });
          },
        }
      );
    } else {
      createBucket.mutate(file, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Image uploaded successfully",
            variant: "default",
          });
        },
      });
    }
  };
  return (
    <ChangeImageDialog onSubmit={handleChangeImage}>
      <div
        className={cn(
          "relative box-content grid size-32 place-items-center overflow-hidden rounded-full border-4 border-white bg-green-50 transition-all duration-200 hover:cursor-pointer",
          updateBucket.isPending || createBucket.isPending || isLoading
            ? ""
            : "[&_div]:invisible [&_div]:hover:visible"
        )}
      >
        {updateBucket.isPending || createBucket.isPending || isLoading ? (
          <Skeleton className="size-32" />
        ) : (
          <>
            {avatar ? (
              <img
                className="absolute left-0 top-0 size-32 rounded-full object-cover"
                srcSet={avatar as string}
                loading="lazy"
                alt={user?.fullName ?? "Avatar"}
              />
            ) : (
              <span className="text-5xl uppercase text-neutral-500">
                {user?.username?.slice(0, 2) || "--"}
              </span>
            )}
            <div className="absolute left-0 top-0 grid size-32 place-items-center bg-black/40">
              <Camera size={32} className="text-white" />
            </div>
          </>
        )}
      </div>
    </ChangeImageDialog>
  );
}
