import http from "../lib/http";
import {
  AccountResType,
  ChangePasswordBodyType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  UpdateMeBodyType,
} from "../schemaValidations/account.schema";

const accountApiRequest = {
  me: () => http.get<AccountResType>("accounts/me"),
  sMe: (accessToken: string) =>
    http.get<AccountResType>("/accounts/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("/accounts/me", body),

  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>("/accounts/change-password", body),

  sChangePasswordV2: (accessToken: string, body: ChangePasswordV2BodyType) =>
    http.put<ChangePasswordV2ResType>("/accounts/change-password-v2", body, {
      headers: {
        Authorization: `Barer ${accessToken}`,
      },
    }),
  changePasswordV2: (body: ChangePasswordV2BodyType) =>
    http.put<ChangePasswordV2ResType>(
      "/api/accounts/change-password-v2",
      body,
      {
        baseUrl: "",
      }
    ),
};

export default accountApiRequest;
