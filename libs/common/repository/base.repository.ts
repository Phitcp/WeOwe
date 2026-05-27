import { Injectable } from "@nestjs/common";
import { Document, Model, QueryFilter, UpdateQuery } from "mongoose";

// libs/common/src/repository/base.repository.ts
@Injectable()
export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findMany(filter: QueryFilter<T>): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async count(filter: QueryFilter<T>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async updateMany(filter: QueryFilter<T>, data: UpdateQuery<T>): Promise<{ matchedCount: number; modifiedCount: number }> {
    const result = await this.model.updateMany(filter, data).exec();
    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }
}