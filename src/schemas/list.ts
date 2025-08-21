import { z } from 'zod';

import priorityEnum from '@/schemas/priority';
import statusEnum from '@/schemas/status';

const listSchema = z
  .object({
    id: z
      .number({
        required_error: 'Id in List is required.',
        invalid_type_error:
          'Id in List should be a number or a type to coerce to number.',
      })
      .positive({ message: "Id in List should be greater than 0 '> 0'." })
      .int({ message: 'Id in List should be an integer number.' }),
    owner: z
      .number({
        required_error: 'Owner in List is required.',
        invalid_type_error:
          'Owner in List should be a number of a type to coerce to number.',
      })
      .positive({ message: "Owner in List should be greater than 0 '> 0'." })
      .int({ message: 'Owner in List should be an integer number.' }),
    name: z
      .string({
        required_error: 'Name in List is required.',
        invalid_type_error: 'Name in List should be a string.',
      })
      .trim()
      .min(1, { message: "Name in List can't be empty." })
      .max(100, { message: 'Name in List must be 100 characters or less.' }),

    description: z
      .string({
        invalid_type_error: 'Description in List should be a string.',
      })
      .trim()
      .max(500, {
        message: 'Description in List must be 500 characters or less.',
      })
      .default(''),

    priority: priorityEnum,

    status: statusEnum,
  })
  .passthrough();

// Create a separate schema for list creation that doesn't require id and owner
const createListSchema = listSchema.omit({ id: true, owner: true });

// type exports
export type ListSchema_Type = z.infer<typeof listSchema>;
export type CreateListSchema_Type = z.infer<typeof createListSchema>;

export { createListSchema };
export default listSchema;
