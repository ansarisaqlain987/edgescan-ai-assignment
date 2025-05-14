import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ options: { allowMixed: 0 } })
class ContentClass {
  @prop({ type: String })
  public userId?: string;

  @prop({ type: String })
  public text?: string;

  @prop({ type: Object })
  public response?: {
    score: number;
    comparative: number;
    calculation: Record<string, number>;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  };
}

export const ContentModel = getModelForClass(ContentClass, {
  schemaOptions: {
    collection: "content",
    timestamps: true,
  },
});
