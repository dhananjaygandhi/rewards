import React, { useState } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import _get from 'lodash/get';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import NoSsr from '@mui/base/NoSsr';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  //Initial Assignment
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [credentials, setCredentials] = useState({
    'email' : '',
    'password': ''
  });
  const [supabase] = useState(() => createBrowserSupabaseClient());

  //Changing The Inputs
  const handleInput = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setCredentials((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }

  const handleClick = async () => {
    setLoading(true);
    if(credentials.email == '' || credentials.password == '') {
      setToast(true);
      setLoading(false);
      return false;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if(error) {
        setLoading(false);
        setToast(true);
      } else {

        const userid = _get(data, 'user.id', '');
        const { data: user, error } = await supabase
        .from('employees')
        .select('*')
        .eq("uuid", userid)
        .single()

        if(user) {
          router.reload();
          // router.push("/dashboard");
        } else {
          router.push("/profile");
        }
      }
    } catch (error) {
      console.log(error);
      setToast(true);
      setLoading(false);
    }
  }

  const toastClose = () => {
    setToast(false);
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <NoSsr>
          <Container maxWidth="xs">
          <div className={styles.description}>
            <Image
              src="/logo.png"
              width={96}
              height={66}
              alt="Logo"
            />
            <h2>
              Winner's Circle
            </h2>
          </div>
          {toast &&
            <Snackbar open={toast} autoHideDuration={6000} onClose={toastClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
              <Alert severity="error">Please enter valid email and password!</Alert>
            </Snackbar>
          }
          <div className={styles.center}>
            <form autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Email'
                    id="user-email"
                    name='email'
                    type='text'
                    onChange={handleInput}
                    autoComplete="off"
                    size="large"
                    margin="dense"
                    variant="standard"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth 
                    label='Password'
                    id="user-password"
                    name='password'
                    type='password'
                    onChange={handleInput}
                    autoComplete="off"
                    size="large"
                    margin="dense"
                    variant="standard"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <LoadingButton
                    fullWidth
                    size="large"
                    onClick={handleClick}
                    endIcon={<SendIcon />}
                    loading={loading}
                    loadingPosition="end"
                    variant="contained"
                  >
                    <span>Login</span>
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </div>
          </Container>
        </NoSsr>
      </main>
    </>
  )
}
