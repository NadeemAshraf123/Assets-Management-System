import { z } from "zod";

// ✅ Define schema
export const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  manager: z.string().min(1, "Manager name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number is required"),
  branchaddress: z.string().min(1, "Branch address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  latitude: z.number(),
  longitude: z.number(),
});

// ✅ Export type inferred from schema
export type BranchFormData = z.infer<typeof branchSchema>;
