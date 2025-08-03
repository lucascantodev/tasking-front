import { z } from 'zod';

export type TaskSchema_Type = z.infer<typeof taskSchema>;

const taskSchema = z.object({
  id: z.coerce
    .number({
      required_error: 'Id in Task is required.',
      invalid_type_error:
        'Id in Task should be a number of a type to coerce to number.',
    })
    .positive({ message: "Id in Task should be greater than 0 '> 0'." })
    .int({ message: 'Id in Task should be an integer number.' }),
  listId: z.coerce
    .number({
      required_error: 'ListId in Task is required.',
      invalid_type_error:
        'ListId in Task should be a number of a type to coerce to number.',
    })
    .positive({ message: "ListId in Task should be greater than 0 '> 0'." })
    .int({ message: 'ListId in Task should be an integer number.' }),
  name: z
    .string({
      required_error: 'Name in Task is required.',
      invalid_type_error: 'Name in Task should be a string.',
    })
    .trim()
    .nonempty({ message: "Name in Task can't be empty." }),
  isComplete: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export default taskSchema;
