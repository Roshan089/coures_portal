import * as yup from 'yup'

export const AgencyValidationSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Agency name must be at least 2 characters')
    .required('Agency name is required'),

  website: yup
    .string()
    .url('Please enter a valid URL')
    .required('Website URL is required'),

  agencySize: yup
    .string()
    .oneOf(
      ['Select size', '10+', '50+', '100+'],
      'Agency size must be one of: 10+, 50+, 100+'
    )
    .notOneOf(['Select size'], 'Please select an agency size')
    .required('Agency size is required'),

  // agencyType: yup
  //   .string()
  //   .oneOf(
  //     [
  //       'Select type',
  //       'Digital Marketing',
  //       'Web Development',
  //       'Advertising',
  //       'Public Relations',
  //       'Creative Design'
  //     ],
  //     'Agency type must be one of: Digital Marketing, Web Development, Advertising, Public Relations, Creative Design'
  //   )
  //   .notOneOf(['Select type'], 'Please select an agency type')
  //   .required('Agency type is required'),

  description: yup
    .string()
    .min(50, 'Description should be at least 50 characters')
    .required('Description is required'),

  location: yup
    .string()
    .min(2, 'Location must be at least 2 characters')
    .required('Location is required'),

  agreement: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms')
    .required('Agreement is required'),
    
  imageUrl: yup.string().url('Please enter a valid URL').notRequired(),
  logoUrl: yup.string().url('Please enter a valid URL').notRequired(),
})

// Define the type for form values
export type AgencyFormValues = yup.InferType<typeof AgencyValidationSchema>
