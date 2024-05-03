import { validateOrReject } from 'class-validator';
import { FieldsOnly } from './types.base';
import { Guard } from '@lib/guard';

export type QueryProps<T> = FieldsOnly<Omit<T, keyof Query>>;

export class Query {
  constructor(props: unknown) {
    if (Guard.isEmpty(props)) {
      throw new Error('query_props_not_provided');
    }
  }

  async validate(): Promise<void> {
    try {
      await validateOrReject(this);
    } catch (_err) {}
  }
}
