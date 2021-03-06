import { Grid } from "@material-ui/core";
import React, { useContext, useReducer } from "react";
import { UserInterface } from "../../../../interfaces/UserInterface";
import { UserContext } from "../../../../Components/Settings/SettingsWrap";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { useMutation } from "@apollo/client";
import {
  EDIT_USER_MUTATION,
  UserInfo,
  UserInfo2,
} from "../../../../apollo/apolloQueries";
import { EditUserData } from "../../../../interfaces/MutationInterfaces";
import { reducer, State } from "../../../../Hooks/Reducers/UserReducer";
import Form1 from "./Form1";
import Form3 from "./Form3";
import Form2 from "./Form2";
import { userValidator } from "../../../../utils/userValidator";
import dynamic from "next/dynamic";

const DynamicSnack = dynamic(
  () => import("../../../Forms/Snackbars/ConfigSnack")
);

const EditForm = () => {
  const [session] = useSession();
  const user: UserInterface = useContext(UserContext);
  const router = useRouter();
  const initState: State = {
    name: user.name,
    phone: user.phone,
    age: user.age,
    country: user.country,
    birthday: user.birthday,
    artLevel: user.artLevel,
    artStyles: user.artStyles,
    artKinds: user.artKinds,
    userBio: user.userBio ? user.userBio : "",
    image: user.image ? user.image : "/user-empty-avatar.png",
    backdrop: user.backdrop ? user.backdrop : "/user-empty-backdrop.jpg",
    placeholder: user.image ? user.image : "/user-empty-avatar.png",
    backdropholder: user.backdrop ? user.backdrop : "/user-empty-backdrop.jpg",
    error: false,
    errMessage: "",
  };
  const [userData, dispatch] = useReducer(reducer, initState);
  const [editUser] = useMutation<EditUserData>(EDIT_USER_MUTATION, {
    update: (cache, mutationResult) => {
      const newUser = mutationResult.data.editUser;
      cache.writeFragment({
        id: `User:${session?.id}`,
        fragment: UserInfo,
        data: {
          id: newUser.id,
          name: newUser.name,
          image: newUser.image,
        },
      });
      cache.writeFragment({
        id: `User:${session?.id}`,
        fragment: UserInfo2,
        data: {
          email: newUser.email,
          backdrop: newUser.backdrop,
          userBio: newUser.userBio,
          birthday: newUser.birthday,
          country: newUser.country,
          phone: newUser.phone,
          artLevel: newUser.artLevel,
          artStyles: newUser.artStyles,
          artKinds: newUser.artKinds,
          age: newUser.age,
        },
      });
    },
  });

  const handleErrorClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch({ type: "ERROR", payload: false });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valid = await userValidator(userData, session?.id);
    if (valid.error && valid.errMessage) {
      dispatch({
        type: "ERROR",
        payload: valid.error,
        message: valid.errMessage,
      });
    } else {
      editUser({
        variables: {
          userId: session?.id,
          name: userData.name,
          country: userData.country,
          birthday: userData.birthday,
          artLevel: userData.artLevel,
          artStyles: userData.artStyles,
          artKinds: userData.artKinds,
          userBio: userData.userBio,
          image: userData.image,
          phone: userData.phone,
          age: userData.age,
          backdrop: userData.backdrop,
        },
      });
      router.push(`/settings/account/`);
    }
  };

  return (
    <>
      <form onSubmit={handleEditSubmit}>
        <Grid container spacing={4}>
          <Form1 user={userData} dispatch={dispatch} />
          <Form3 user={userData} dispatch={dispatch} />
          <Form2 user={userData} dispatch={dispatch} />
        </Grid>
      </form>
      <DynamicSnack
        error={userData.error}
        errMessage={userData.errMessage}
        handleErrorClose={handleErrorClose}
      />
    </>
  );
};

export default EditForm;
