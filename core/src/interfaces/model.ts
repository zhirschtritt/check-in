export class Timestamped {
  public createdAt?: Date;
  public updatedAt?: Date;
}

export class Model extends Timestamped {
  id?: string;
}
