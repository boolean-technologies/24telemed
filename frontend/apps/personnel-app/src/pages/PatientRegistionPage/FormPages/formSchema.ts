import * as yup from 'yup';
enum gender {
  MALE = 'Male',
  FEMALE = 'Female',
}


export const ContactDataSchema = yup.object().shape({
  phone_number: yup.string().required('Phone number is required'),
  email: yup.string().email().required('Email address is required'),
  address: yup.string().required('Residential address is required'),
  city: yup.string().required('City is required'),
});

export const BiopageSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required '),
  gender: yup.string().oneOf(Object.values(gender)).required("Gender is required"),
  date_of_birth: yup.string().required('Date of birth is required'),
});

export const MedicalDataSchema = yup.object().shape({
  medical_history: yup.string(),
  allergies: yup.string(),
  chronic_conditions: yup.string(),
  blood_type: yup.string().required('Blood type is required'),
  genetype: yup.string().required('Genotype is required'),
  weight: yup.number().transform((value) => (isNaN(value) ? undefined : value)).required('Weight is required'),
  height: yup.number().transform((value) => (isNaN(value) ? undefined : value)).required('Height is required'),
  immunization_records: yup
    .string(),
  family_medical_history: yup
    .string(),
});
