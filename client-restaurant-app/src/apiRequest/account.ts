import http from "../lib/http";
import { AccountType } from "../schemaValidations/account.schema";

const accountApiRequest = {
  me: () => http.get<AccountType>("accounts/me"),
};

export default accountApiRequest;
