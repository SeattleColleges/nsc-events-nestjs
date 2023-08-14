import { Model, models, model } from 'mongoose';
import { Document, Schema } from 'mongoose';
// import bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
}

export enum Role {
  Admin = 'admin',
  Creator = 'creator',
  User = 'user',
}
// interface Methods {
//   comparePassword(password: string): Promise<boolean>;
// }

export const UserSchema = new Schema<UserDocument /*{}, Methods*/>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: false },
  role: { type: String, enum: Object.values(Role), default: Role.User },
});

// Hash the password before saving
// userSchema.pre('save', async function (next) {
//   // hash only when password changes
//   if (!this.isModified('password')) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     throw error;
//   }
// });

// Compare password method
// userSchema.methods.comparePassword = async function (password) {
//   try {
//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     throw error;
//   }
// };

const UserModel = models.User || model('User', UserSchema);

export default UserModel as Model<UserDocument /*{}, Methods*/>;
