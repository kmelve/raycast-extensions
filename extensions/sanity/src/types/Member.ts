import { SanityUser } from "@sanity/client";
import { Role } from "./Role";

export interface Member {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isCurrentUser: boolean;
  isRobot: boolean;
  roles: Role[];
}

export interface SanityExtendedUser extends SanityUser {
  email: string;
  provider: "google" | "github" | "sanity" | "sso" | "email" | "sanity-token";
  isCurrentUser: boolean;
}
