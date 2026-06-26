import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Navbar from '../../components/Navbar/Navbar';
import AuthSection from '../../components/AuthSection/AuthSection';
import styles from '../Register/Register.module.css';

// Register için gerekli asset'ler (Dosya yollarını projene göre kontrol et)
import catImg from '../../assets/Register_Cat.png'; // Sol taraftaki kedi resmi

import eyeIcon from '../../assets/eye.svg';
import eyeOffIcon from '../../assets/eye-off.svg';
import crossIcon from '../../assets/cross.svg'; 
import checkIcon from '../../assets/check.svg'; 

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Kayıt formunun doğrulama kuralları
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
       .required('Name is required')
      .matches(/^[a-zA-Z0-9]*$/, 'Password cannot contain special characters'),
    email: Yup.string()
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Enter a valid Email')
      .required('Email is required'),
    password: Yup.string()
      .matches(/^[a-zA-Z0-9]*$/, 'Password cannot contain special characters')
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Kayıt İsteti Gönderiliyor:', values);
      // Buraya daha sonra register thunk'ını bağlayacağız
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
      <Navbar />

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