import { useMutation, useQuery } from "@tanstack/react-query";
import accountApiRequest from "../apiRequest/account";
import { ChangePasswordBody } from "../schemaValidations/account.schema";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: accountApiRequest.me,
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePasswordV2,
  });
};
