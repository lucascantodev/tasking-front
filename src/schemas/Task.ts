import { z } from 'zod';

export type Task = z.infer<typeof task>;

const task = z.object({
  // ID
  id: z.coerce
    .number({
      required_error: 'Id in Task is required.',
      invalid_type_error:
        'Id in Task should be a number of a type to coerce to number.',
    })
    .positive({ message: "Id in Task should be greater than 0 '> 0'." })
    .int({ message: 'Id in Task should be an integer number.' }),
  // LISTID
  listId: z.coerce
    .number({
      required_error: 'ListId in Task is required.',
      invalid_type_error:
        'ListId in Task should be a number of a type to coerce to number.',
    })
    .positive({ message: "ListId in Task should be greater than 0 '> 0'." })
    .int({ message: 'ListId in Task should be an integer number.' }),
  // NAME
  name: z
    .string({
      required_error: 'Name in Task is required.',
      invalid_type_error: 'Name in Task should be a string.',
    })
    .trim()
    .nonempty({ message: "Name in Task can't be empty." }),
});

export default task;
