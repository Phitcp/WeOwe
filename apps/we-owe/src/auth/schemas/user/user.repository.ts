import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { BaseRepository } from "libs/common/repository/base.repository";
import { User, UserDocument } from "./user.schema";

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name)
    model: Model<UserDocument>,
  ) {
    super(model);
  }
}
