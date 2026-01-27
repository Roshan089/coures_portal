'use client'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { yupResolver } from '@hookform/resolvers/yup'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import { AppIconButton } from '@/components'
import CustomDropdown from '@/components/common/AppDropdown/AppDropdown'
import InputField from '@/components/common/AppInput/AppInput'
import AboutTextField from '@/components/common/AppTextField/AppTextFeild'
import { AgencyCreationHooray } from '@/components/Recruitment/AgencyCreationHooray'
import { agencySizes, agencyTypes } from './CreateData'
import { AgencyFormValues, AgencyValidationSchema } from '@/yup/agencyValidationSchema'
import { RECRUITMENT_ROUTES } from '@/shared/constants/routes/recruitment.routes'
import { RootState } from '@/store/store'
import { setAgencyProfile } from '@/store/features/AgencyProfile/agencyProfileSlice'      
import { useDispatch, useSelector } from 'react-redux'
import { useSubmitAgencyProfileMutation } from '@/store/api/agencyApiSlice'
import { setAuthState, updateUserType } from '@/store/features/auth/authSlice'
import { AGENCY_ROUTES } from '@/shared/constants/routes/agency.routes'

function CreateAgencyProfile() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<AgencyFormValues>({
    resolver: yupResolver(AgencyValidationSchema),
    defaultValues: {
      name: '',
      website: '',
      agencySize: 'Select size',
      description: '',
      location: '',
      agreement: false
    }
  })
  console.log('currentUser', currentUser)
  const [submitAgencyProfile] = useSubmitAgencyProfileMutation();

  const [showHooray, setShowHooray] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const onSubmit = async (data: AgencyFormValues) => {
    console.log('Form submission with data: ', data)
    setIsSubmitting(true);
    
    try {
      const transformedData = {
        ...data,
        agencySize: data.agencySize !== 'Select size' ? parseInt(data.agencySize.replace('+', ''), 10) : 0,
        imageUrl: data.imageUrl || 'https://placehold.co/600x400',
        logoUrl: data.logoUrl || 'https://placehold.co/600x400'
      }
      
      console.log('Transformed data: ', transformedData)
      
      // Submit agency profile
      const response = await submitAgencyProfile(transformedData).unwrap();
      console.log('Agency profile created:', response)
      
      if (response) {
        // Update all state in parallel for better performance
        await Promise.all([
          dispatch(updateUserType(response)),
          dispatch(setAuthState(true)),
          dispatch(setAgencyProfile(response))
        ]);
        
        // Navigate immediately after state updates
        router.push(AGENCY_ROUTES.DASHBOARD);
      }
    } catch (error) {
      console.error("Error occurred during form submission: ", error);
      // Show user-friendly error message
      alert("Failed to create agency profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      {/* Main Container */}
      <Box
        sx={{
          width: '100%',
          padding: '0.5rem',
          maxWidth: '1100px',
          borderRadius: '8px',
          overflowY: 'hidden'
        }}
      >
        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            textAlign: 'start',
            fontWeight: '500',
            fontSize: '28px'
          }}
        >
          Create Agency Profile
        </Typography>

        {/* Upload Section */}
        <Box
          sx={{
            mb: 4,
            height: '11rem',
            display: 'flex',
            justifyContent: 's',
            alignItems: 'center',
            backgroundColor: 'info.main',
            borderRadius: '12px',
            padding: '10px 20px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              FlexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '150px',
              height: '10rem',
              backgroundColor: '#ABE8FF',
              borderRadius: '50%',
              flexDirection: 'column'
            }}
          >
            <img
              src="https://dummyimage.com/150x150/cccccc/000000&text=Logo"
              alt="Agency Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>

          <img
            src="https://dummyimage.com/500x150/cccccc/000000&text=Cover+Image"
            alt="Agency Cover Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            spacing={12}
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            {/* Left part of the form */}
            <Grid
              size={6}
              spacing={40}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginRight: '10rem'
              }}
            >
              {/* Form inputs */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Agency Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Website URL"
                    error={!!errors.website}
                    helperText={errors.website?.message}
                  />
                )}
              />
              <Controller
                name="agencySize"
                control={control}
                render={({ field }) => (
                  <Box sx={{ position: 'relative', width: '100%' }}>
                    <CustomDropdown
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      options={['Select size', ...agencySizes]}
                      label="Agency Size"
                      error={!!errors.agencySize}
                      helperText={errors.agencySize?.message}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        pointerEvents: 'none'
                      }}
                    >
                      <ArrowDropDownIcon sx={{ color: '#767676', transform: 'translateY(10px)' }} />
                    </Box>
                  </Box>
                )}
              />

             
            </Grid>

            {/* Right part of the form */}
            <Grid
              size={6}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                marginRight: '2rem',
                justifyContent: {
                  xs: 'center',
                  sm: 'flex-start'
                },
                alignItems: {
                  xs: 'center',
                  sm: 'flex-start'
                },
                width: '100%'
              }}
            >
              {/* About */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <AboutTextField
                    {...field}
                    lable="About"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />

              {/* Location */}
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Location"
                    error={!!errors.location}
                    helperText={errors.location?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Agreement Section */}
          <FormControlLabel
            control={
              <Controller
                name="agreement"
                control={control}
                render={({ field }) => <Checkbox {...field} />}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                I confirm that I am an authorized representative of this
                organization and have the authority to create and manage this
                page on its behalf. Both the organization and I agree to comply
                with the additional terms applicable to Pages.
              </Typography>
            }
            sx={{ mt: 3, alignItems: 'flex-start' }}
          />

          {/* Show error message for agreement */}
          {errors.agreement && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.agreement.message}
            </Typography>
          )}

          {/* Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 4
            }}
          >
            <AppIconButton
              type="submit"
              color="secondary.main"
              disabled={isSubmitting}
              sx={{
                textTransform: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                fontSize: '1rem'
              }}
            >
              {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
            </AppIconButton>
          </Box>
        </form>
      </Box>

      <AgencyCreationHooray
        isOpen={showHooray}
        onClose={() => {
          setShowHooray(false)
          router.push(AGENCY_ROUTES.DASHBOARD)
        }}
      />
    </Box>
  )
}

export default CreateAgencyProfile
