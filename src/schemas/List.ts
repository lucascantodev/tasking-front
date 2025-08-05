import { z } from 'zod';

const priorityEnum = z.enum(['low', 'medium', 'high'], {
  required_error: 'Priority is required.',
  invalid_type_error: 'Priority must be one of: low, medium, high.',
});

const statusEnum = z.enum(['not-started', 'in-progress', 'completed'], {
  required_error: 'Status is required.',
  invalid_type_error:
    'Status must be one of: not-started, in-progress, completed.',
});

const listSchema = z
  .object({
    /* id: z
      .number({
        required_error: 'Id in List is required.',
        invalid_type_error:
          'Id in List should be a number of a type to coerce to number.',
      })
      .positive({ message: "Id in List should be greater than 0 '> 0'." })
      .int({ message: 'Id in List should be an integer number.' }), */

    /* owner: z
      .number({
        required_error: 'Owner in List is required.',
        invalid_type_error:
          'Owner in List should be a number of a type to coerce to number.',
      })
      .positive({ message: "Owner in List should be greater than 0 '> 0'." })
      .int({ message: 'Owner in List should be an integer number.' }), */

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

// type exports
export type ListSchema_Type = z.infer<typeof listSchema>;
export type Priority = z.infer<typeof priorityEnum>;
export type Status = z.infer<typeof statusEnum>;

export default listSchema;
export { priorityEnum, statusEnum };
