import { IEvent } from '@nestjs/cqrs';

export class KidCheckedInEvent implements IEvent {
    constructor(
        public readonly kidId: string,
        public readonly locationId: string,
    ){}
}
