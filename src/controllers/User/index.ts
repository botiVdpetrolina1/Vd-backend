import { createUser } from "./createUser";
import { loginUser } from "./loginUser";
import { updateCurrentUser } from "./updateMyUser";
import { getUser } from "./getMyUser";

export const UserController = {
  createUser,
  loginUser,
  getUser,
  updateCurrentUser
};
