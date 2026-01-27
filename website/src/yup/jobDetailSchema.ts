import * as yup from "yup";

export const jobDetailsFormSchema = yup.object({
  title: yup.string().required("Job Role is required"),
  companyId: yup.string().required("Company id is required"),
  userId: yup.string().required("User id is required"),
  minExperience: yup
    .number()
    .required("Min Experience is required")
    .test("is-number", "Must be a number", (value) => !isNaN(Number(value))),
  maxExperience: yup
    .number()
    .test("is-number", "Must be a number", (value) => !isNaN(Number(value)))
    .test("greater-than-min", "Max experience must be greater than min experience", function(value) {
      const { minExperience } = this.parent;
      if (value && minExperience && Number(value) <= Number(minExperience)) {
        return false;
      }
      return true;
    }),
  minSalary: yup
    .number()
    .required("Min Salary is required")
    .typeError("Min salary must be a number")
    .test("is-number", "Min salary must be a number", (value) => !isNaN(Number(value))),
  maxSalary: yup
    .number()
    .required("Max Salary is required")
    .typeError("Max salary must be a number")
    .test("is-number", "Max salary must be a number", (value) => !isNaN(Number(value)))
    .test("greater-than-min", "Max salary must be greater than min salary", function(value) {
      const { minSalary } = this.parent;
      if (value && minSalary && Number(value) <= Number(minSalary)) {
        return false;
      }
      return true;
    }),
  jobType: yup.string().required("Job Type is required"),
  workLevel: yup.string().required("Work Level is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  description: yup.string().required("Description is required").test(
    "not-empty-after-strip",
    "Description cannot be empty",
    (value) => {
      if (!value) return false;
      const strippedValue = value.replace(/<[^>]*>/g, '').trim();
      return strippedValue.length > 0;
    }
  ),
  status: yup.string().oneOf(["Active", "Inactive"], "Invalid status"),
  skillsRequired: yup
    .array()
    .of(yup.string())
    .min(1, "At least one skill is required")
    .required("At least one skill is required"),
  qualificationFilter: yup
    .boolean()
    .default(false),
});

// Export the schema's inferred type
export type jobDetailsFormValues = yup.InferType<typeof jobDetailsFormSchema>; 