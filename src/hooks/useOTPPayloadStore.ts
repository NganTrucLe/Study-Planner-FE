import { create } from "zustand";

import { EnumActionOTP } from "@/lib/enums";
import { OTPPayload } from "@/services";

type Action = {
  setPayload: (payload: OTPPayload) => void;
  clearPayload: () => void;
};

const initialState: OTPPayload = {
  email: "",
  action: EnumActionOTP.resetPassword,
};
export const useOTPPayloadStore = create<OTPPayload & Action>((set) => ({
  ...initialState,
  setPayload: (payload: OTPPayload) => set(payload),
  clearPayload: () => set(initialState),
}));
