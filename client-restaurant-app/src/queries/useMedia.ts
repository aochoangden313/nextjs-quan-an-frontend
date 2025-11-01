import { useMutation } from "@tanstack/react-query";
import mediaApiRequest from "../apiRequest/media";

export const useMediaMutation = () => {
  return useMutation({
    mutationFn: mediaApiRequest.upload,
  });
};
