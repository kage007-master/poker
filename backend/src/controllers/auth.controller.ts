import UserModel from "../models/User";
import { User } from "../types/User";

const authController = {
  getUser: async (address: string) => {
    try {
      const user: User | null = await UserModel.findOne({ address });
      return user;
    } catch (err) {
      console.log("Error on getting user");
      console.error(err);
    }
  },

  updateUser: async (user: User) => {
    await UserModel.findOneAndUpdate({ address: user.address }, user);
  },

  updateBalance: async (address: string, amount: number) => {
    const user = await authController.getUser(address);
    if (user) {
      user.balance.ebone += amount;
      authController.updateUser(user);
    }
  },
};

export default authController;
