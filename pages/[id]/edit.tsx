import { NumberFormatValues } from "react-number-format";
import React, { useReducer } from "react";
import { CssBaseline, Paper, Grid } from "@material-ui/core";
import Appbar from "../../Components/Appbar/Appbar";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/General/Create.module.css";
import { fetchAPost } from "../../utils/fetchData";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/client";
import { PostInterface } from "../../interfaces/PostInterface";
import { EDIT_POST_MUTATION } from "../../apollo/apolloQueries";
import { useMutation } from "@apollo/client";
import EditPostForm from "../../Components/Forms/EditPost";
import { reducer, State } from "../../Hooks/Reducers/PostReducer";
import {
  EditPostData,
  EditPostVars,
} from "../../interfaces/MutationInterfaces";

const Create = ({ postId }: { postId: PostInterface }) => {
  const initState: State = {
    title: postId.title,
    description: postId.description,
    art: postId.art,
    price: postId.price,
    sale: postId.sale,
    tags: postId.tags as string[],
  };
  const [post, dispatch] = useReducer(reducer, initState);
  const [edit] = useMutation<EditPostData, EditPostVars>(EDIT_POST_MUTATION);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "CHANGE",
      field: (e.target as HTMLInputElement).name,
      payload: (e.target as HTMLInputElement).value,
    });
  };

  const handleTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "TAGS", payload: (e.target as HTMLInputElement).value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    edit({
      variables: {
        postId: postId.id,
        title: post.title,
        description: post.description,
        tags: post.tags,
      },
    });
    router.push("/home");
  };

  const handleNumber = (values: NumberFormatValues) => {
    dispatch({ type: "CHANGE", field: "price", payload: values.value });
  };

  const handleSale = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SALE", payload: (e.target as HTMLInputElement).value });
  };

  return (
    <div className={styles.root}>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Edit</title>
      </Head>
      <CssBaseline />
      <Appbar />
      <Grid container className={styles.grid}>
        <Grid item xs={false} sm={4} md={7} className={styles.displayArt}>
          {/* Art Display */}
          <div className={styles.artContainer}>
            <Image
              src={post.art}
              layout="fill"
              objectFit="contain"
              objectPosition="center"
            />
          </div>
          {/* Art Display */}
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={styles.paper}>
            <EditPostForm
              post={post}
              handleSale={handleSale}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleTags={handleTags}
              handleNumber={handleNumber}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const postId = await fetchAPost(context.params.id as string);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      postId,
    },
  };
};

export default Create;
