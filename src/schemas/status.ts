import { z } from 'zod';

const statusEnum = z.enum(['not-started', 'in-progress', 'completed'], {
  required_error: 'Status is required.',
  invalid_type_error:
    'Status must be one of: not-started, in-progress, completed.',
});

export type Status = z.infer<typeof statusEnum>;
export default statusEnum;
