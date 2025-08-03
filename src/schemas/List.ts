import { z } from 'zod';

export type ListSchema_Type = z.infer<typeof listSchema>;

const listSchema = z.object({
  id: z.coerce
    .number({
      required_error: 'Id in List is required.',
      invalid_type_error:
        'Id in List should be a number of a type to coerce to number.',
    })
    .positive({ message: "Id in List should be greater than 0 '> 0'." })
    .int({ message: 'Id in List should be an integer number.' }),
  name: z
    .string({
      required_error: 'Name in List is required.',
      invalid_type_error: 'Name in List should be a string.',
    })
    .trim()
    .nonempty({ message: "Name in List can't be empty." }),
});

export default listSchema;