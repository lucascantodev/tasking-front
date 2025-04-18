import { z } from "zod";


export type User = z.infer<typeof user>;

const user = z.object({
    id: z.coerce.number({ 
        required_error: "Id in User is required.",
        invalid_type_error: "Id in User should be a number of a type to coerce to number."
    })
    .positive({ message: "Id in user should be greater than 0 '> 0'." })
    .int({ message: "Id in User should be an integer number." }),
    username: z.string({
        required_error: "Username in User is required.",
        invalid_type_error: "Username in User should be a string."
    })
    .trim()
    .nonempty({ message: "Username in User can't be empty." }),
    password: z.string({
        required_error: "Password in User is required.",
        invalid_type_error: "Password in User should be a string."
    })
    .trim()
    .min(8, { message: "Password in User need to have at least 8 characters." })
});

export default user;