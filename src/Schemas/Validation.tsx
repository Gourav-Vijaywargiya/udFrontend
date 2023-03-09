import * as Yup from 'yup';

export const registrationSchema = Yup.object({
    mobile : Yup.number().min(10).max(10).required('please enter mobile number'),
    dob : Yup.date().max(new Date()).required('please enter date of birth'),
    gender: Yup.string().required('Please enter your gender'),
    aboutme : Yup.string().required('Please enter about yourself')
})