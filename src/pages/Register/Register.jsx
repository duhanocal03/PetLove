import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux'; // 🚀 Redux bağlantısı eklendi

import { register } from '../../redux/auth/operations'; // 🚀 Path'i klasör yapına göre kontrol edebilirsin
import AuthSection from '../../components/AuthSection/AuthSection';
import styles from './Register.module.css';

// Asset'ler
import catImg from '../../assets/Register_Cat.png'; 
import eyeIcon from '../../assets/eye.svg';
import eyeOffIcon from '../../assets/eye-off.svg';
import crossIcon from '../../assets/cross.svg'; 
import checkIcon from '../../assets/check.svg'; 

const Register = () => {
  const dispatch = useDispatch(); // 🚀 Dispatch hook'u tanımlandı
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Kayıt formunun doğrulama kuralları
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .matches(/^[a-zA-Z0-9]*$/, 'Name cannot contain special characters')
      .required('Name is required'),
    email: Yup.string()
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Enter a valid Email')
      .required('Email is required'),
    password: Yup.string()
      .matches(/^[a-zA-Z0-9-!-.]*$/, 'Password cannot contain special characters')
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      // 1. Formik'in asenkron süreçte takılıp döngü yaratmasını engellemek için submit kilidini kaldırıyoruz
      actions.setSubmitting(false);

      // 2. Orijinal formu bozmadan bir kopyasını alıp confirmPassword'ü güvenle siliyoruz
      const submitData = { ...values };
      delete submitData.confirmPassword;
      
      // 3. 🚀 Swagger API'ye kayıt isteğini tek bir kez tetikliyoruz
      dispatch(register(submitData));
    },
  });

  const getInputClass = (fieldName) => {
    if (formik.touched[fieldName] && formik.errors[fieldName]) {
      return `${styles.inputField} ${styles.errorInput}`;
    }
    if (formik.touched[fieldName] && !formik.errors[fieldName] && formik.values[fieldName] !== '') {
      return `${styles.inputField} ${styles.successInput}`;
    }
    return styles.inputField;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        
        {/* Sol Taraf: Dinamik Kedi Alanı */}
        <div className={styles.leftColumn}>
          <AuthSection 
            image={catImg}
            name="Jack"
            birthday="18.10.2021"
            description="Jack is a gray Persian cat with green eyes. He loves to be pampered and groomed, and enjoys playing with toys."
            icon="🐈"
          />
        </div>

        {/* Sağ Taraf: Kayıt Formu */}
        <div className={styles.rightColumn}>
          <div className={styles.formContainer}>
            <h1 className={styles.formTitle}>Registration</h1>
            <p className={styles.formSubtitle}>
              Thank you for your interest in our platform! Please enter your details:
            </p>

            <form onSubmit={formik.handleSubmit} className={styles.mainForm}>
              
              {/* Name Input */}
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  className={getInputClass('name')}
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name && (
                  <img src={crossIcon} alt="Error" className={styles.statusIcon} />
                )}
                {formik.touched.name && !formik.errors.name && formik.values.name !== '' && (
                  <img src={checkIcon} alt="Success" className={styles.statusIcon} />
                )}
                {formik.touched.name && formik.errors.name && (
                  <div className={styles.errorMessage}>{formik.errors.name}</div>
                )}
              </div>

              {/* Email Input */}
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className={getInputClass('email')}
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <img src={crossIcon} alt="Error" className={styles.statusIcon} />
                )}
                {formik.touched.email && !formik.errors.email && formik.values.email !== '' && (
                  <img src={checkIcon} alt="Success" className={styles.statusIcon} />
                )}
                {formik.touched.email && formik.errors.email && (
                  <div className={styles.errorMessage}>{formik.errors.email}</div>
                )}
              </div>

              {/* Password Input */}
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  name="password"
                  className={getInputClass('password')}
                  {...formik.getFieldProps('password')}
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img src={showPassword ? eyeIcon : eyeOffIcon} alt="Toggle Password" />
                </button>
                {formik.touched.password && formik.errors.password && (
                  <img src={crossIcon} alt="Error" className={styles.statusIconWithEye} />
                )}
                {formik.touched.password && !formik.errors.password && formik.values.password !== '' && (
                  <img src={checkIcon} alt="Success" className={styles.statusIconWithEye} />
                )}
                {formik.touched.password && formik.errors.password && (
                  <div className={styles.errorMessage}>{formik.errors.password}</div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className={styles.inputWrapper}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  name="confirmPassword"
                  className={getInputClass('confirmPassword')}
                  {...formik.getFieldProps('confirmPassword')}
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img src={showConfirmPassword ? eyeIcon : eyeOffIcon} alt="Toggle Password" />
                </button>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <img src={crossIcon} alt="Error" className={styles.statusIconWithEye} />
                )}
                {formik.touched.confirmPassword && !formik.errors.confirmPassword && formik.values.confirmPassword !== '' && (
                  <img src={checkIcon} alt="Success" className={styles.statusIconWithEye} />
                )}
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className={styles.errorMessage}>{formik.errors.confirmPassword}</div>
                )}
              </div>

              <button type="submit" className={styles.submitBtn}>
                REGISTRATION
              </button>
            </form>

            <p className={styles.switchPageText}>
              Already have an account? <Link to="/login" className={styles.linkText}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;