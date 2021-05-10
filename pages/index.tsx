import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  Toolbar,
  CssBaseline,
  Paper,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import PaletteIcon from "@material-ui/icons/Palette";
import styles from "./styles/General/Login.module.css";
import Head from "next/head";
import { getSession, signIn } from "next-auth/client";
import { GetServerSideProps } from "next";

const Login = () => {
  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link href="/#">Canvas</Link> {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signIn(null, { callbackUrl: `${process.env.WEB_URL}/home` });
  };

  return (
    <div>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Obra</title>
      </Head>

      <Grid container className={styles.root}>
        <CssBaseline />
        {/* Side Image */}
        <Grid item xs={12} sm={4} md={7} className={styles.sideImage}>
          <Image
            src="https://picsum.photos/600"
            alt="Scenery image"
            layout="fill"
            objectFit="cover"
            objectPosition="center left"
          />
        </Grid>
        {/* Side Image */}

        {/* Form */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={styles.paper}>
            <Toolbar>
              <PaletteIcon fontSize="large" />
              <Typography variant="h4" color="inherit" noWrap>
                Obra
              </Typography>
            </Toolbar>
            <br />
            <Typography variant="h5">
              Canvas is a website that focuses on Artists, giving them an
              opportunity to shine amidst the shame that brings upon the Art
              Community.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={styles.submit}
              onClick={handleSignIn}
            >
              Log In
            </Button>
          </div>
          {/*Copyright*/}
          <Copyright />
          {/*Copyright*/}
        </Grid>
        {/* Form */}
      </Grid>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};

export default Login;
