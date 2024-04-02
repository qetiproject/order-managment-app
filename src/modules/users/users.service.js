import User from "./user.model.js";

export async function createUser(body) {
  const newUser = new User(body);
  await newUser.save();
  return newUser;
}

export async function getUsers() {
  const users = await User.find();
  return users;
}

export async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export async function deleteUser(userId) {
  const user = await getUserById(userId);
  await user.deleteOne();
  return user;
}

export async function updateUser(userId, body) {
  const user = await getUserById(userId);
  Object.assign(user, body);
  await user.save();
  return user;
}
