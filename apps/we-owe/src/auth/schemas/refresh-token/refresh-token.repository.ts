import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { RefreshToken, RefreshTokenDocument } from "./refresh-token.schema";
import { BaseRepository } from "libs/common/repository/base.repository";

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshTokenDocument> {
  constructor(
    @InjectModel(RefreshToken.name)
    model: Model<RefreshTokenDocument>,
  ) {
    super(model);
  }

}
