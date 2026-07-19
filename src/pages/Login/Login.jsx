import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { logIn } from '../../redux/auth/operations'; 

import AuthSection from '../../components/AuthSection/AuthSection';
import styles from './Login.module.css';
import dogImg from '../../assets/Login_Dog.png';
import crossIcon from '../../assets/cross.svg';
import checkIcon from '../../assets/check.svg';
import eyeIcon from '../../assets/eye.svg';
import eyeOffIcon from '../../assets/eye-off.svg';

const Login = () => {
  const dispatch = useDispatch(); 
  const [showPassword, setShowPassword] = useState(false); 

  // Şifre doğrulama şeması
  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Enter a valid Email')
      .required('Email is required'),
    password: Yup.string()
      .matches(/^[a-zA-Z0-9-!-.]*$/, 'Password cannot contain special characters')
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(logIn(values));
    },
  });

  // İnput durum sınıfları
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
        <div className={styles.leftColumn}>
          <AuthSection 
            image={dogImg}
            name="Rich"
            birthday="21.09.2020"
            description="Rich would be the perfect addition to an active family that loves to play and go on walks. I bet he would love having a doggy playmate too!"
            icon="🐶"
          />
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.formContainer}>
            <h1 className={styles.formTitle}>Log in</h1>
            <p className={styles.formSubtitle}>
              Welcome! Please enter your credentials to login to the platform:
            </p>

            <form onSubmit={formik.handleSubmit} className={styles.mainForm}>
              
              {/* Email Alanı */}
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
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

              {/* Password Alanı */}
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className={getInputClass('password')}
                  {...formik.getFieldProps('password')}
                />
                
                {/* Göz İkonu Butonu */}
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img src={showPassword ? eyeIcon : eyeOffIcon} alt="Toggle Password" />
                </button>

                {/* Şifre Hata / Başarı Durum İkonları */}
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

              <button type="submit" className={styles.submitBtn}>
                LOG IN
              </button>
            </form>

            <p className={styles.switchPageText}>
              Don't have an account? <Link to="/register" className={styles.linkText}>Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;