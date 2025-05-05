import { getModelForClass, prop } from "@typegoose/typegoose";

class KittenClass {
  @prop({
    type: String,
  })
  public name?: string;
}

export const KittenModel = getModelForClass(KittenClass);
