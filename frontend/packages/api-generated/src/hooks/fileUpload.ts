import { useMutation } from '@tanstack/react-query';

import { File, FileService } from '@local/api-generated';

export const useUploadFile = () =>
  useMutation({
    mutationFn: (file: File) => FileService.fileCreate(file),
  });
