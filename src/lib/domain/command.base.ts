import { validateOrReject } from 'class-validator';
import { Guard } from '@lib/guard';
import { FieldsOnly } from './types.base';

export type CommandProps<T> = FieldsOnly<Omit<T, keyof Command>>;

export class Command {
  constructor(props: unknown) {
    if (Guard.isEmpty(props)) {
      throw new Error('command_props_not_provided');
    }
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
