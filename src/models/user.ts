import { getModelForClass, prop } from "@typegoose/typegoose";

class User {
  @prop({
    type: String,
  })
  public name?: string;

  @prop({
    type: String,
  })
  public email?: string;

  @prop({
    type: String,
  })
  public id?: string;
}

export const UserModel = getModelForClass(User);
