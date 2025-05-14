import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ options: { allowMixed: 0 } })
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
