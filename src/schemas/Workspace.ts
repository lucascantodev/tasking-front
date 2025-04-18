import { z } from "zod";


export type Workspace = z.infer<typeof workspace>;

const workspace = z.object({
    // ID
    id: z.coerce.number({ 
        required_error: "Id in Workspace is required.",
        invalid_type_error: "Id in Workspace should be a number of a type to coerce to number."
    })
    .positive({ message: "Id in Workspace should be greater than 0 '> 0'." })
    .int({ message: "Id in Workspace should be an integer number." }),
    // USERID
    userId: z.coerce.number({ 
        required_error: "UserId in Workspace is required.",
        invalid_type_error: "UserId in Workspace should be a number of a type to coerce to number."
    })
    .positive({ message: "UserId in Workspace should be greater than 0 '> 0'." })
    .int({ message: "UserId in Workspace should be an integer number." }),
    // NAME
    name: z.string({ 
        required_error: "Name in Workspace is required.",
        invalid_type_error: "Name in Workspace should be a string."
    })
    .trim()
    .nonempty({ message: "Name in Workspace can't be empty." }),
    // DESCRIPTION
    description: z.string({ 
        required_error: "Description in Wokspace is required.",
        invalid_type_error: "Description in Workspace should be a string."
    })
    .trim()
    .nonempty({ message: "Description in Workspace can't be empty." }),
    // PRIORITY
    priority: z.union(
        [ z.literal("high"), z.literal("medium"), z.literal("low") ], 
        { 
            required_error: "Priority in Workspace is required.",
            invalid_type_error: "Priority should be one of the following literals 'high' | 'medium' | 'low'" 
        }
    ),
    // STATUS
    status: z.union(
        [ z.literal("not-started"), z.literal("in-progress"), z.literal("completed"), z.literal("waiting") ],
        {
            required_error: "Status in Workspace is required.",
            invalid_type_error: `Status in Workspace should be one of the following literals 
            'not-started' | 'in-progress' | 'completed' | 'waiting' `
        }
    )
});

export default workspace;