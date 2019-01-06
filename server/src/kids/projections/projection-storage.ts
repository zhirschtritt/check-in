import {Collection} from '@lokidb/loki';
import {Doc} from '@lokidb/loki/types/common/types';
import {ResultSet} from '@lokidb/loki/types/loki/src/result_set';

export class ProjectionStorage {
  constructor(private readonly collection: Collection) {}

  async save(document: Doc): Promise<Doc<object>> {
    return this.collection.insertOne(document);
  }

  async findOne(query: ResultSet.Query<Doc<object>>): Promise<Doc<object>> {
    return this.collection.findOne(query);
  }

  async delete(documentId: number): Promise<void> {
    return this.collection.remove(documentId);
  }

  async update(
    filter: (obj: Doc<object>) => boolean,
    update: (obj: Doc<object>) => Doc<object>,
  ): Promise<void> {
    return this.collection.updateWhere(filter, update);
  }
}
