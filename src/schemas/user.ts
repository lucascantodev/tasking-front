import { z } from 'zod';

export type UserSchema_Type = z.infer<typeof userSchema>;

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export default userSchema;