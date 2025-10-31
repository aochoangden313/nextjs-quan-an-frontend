import { useQuery } from "@tanstack/react-query";
import accountApiRequest from "../apiRequest/account";

export const useAccountProfile = () => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: accountApiRequest.me,
  });
};
