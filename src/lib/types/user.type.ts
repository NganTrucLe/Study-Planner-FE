import { EnumGender } from "../enums";
import { Image } from "./common.type";

export type AccountIdentifier = {
  username: string;
  id: string;
  dob: string;
};

export type Level = {
  id: number;
  xp: number;
};

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName: string | null;
  dob: Date | null | string;
  gender: EnumGender | null;
  createdAt: string;
  avatarId: string | null;
  avatar?: Image;
};
