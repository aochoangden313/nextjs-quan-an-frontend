import { useMutation } from "@tanstack/react-query";
import authApiRequest from "../apiRequest/auth";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.login,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.logout,
  });
};
