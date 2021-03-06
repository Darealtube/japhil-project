import { initializeApollo } from "../apollo/apolloClient";
import { USER_EXISTS } from "../apollo/apolloQueries";
import { isValidPhoneNumber } from "libphonenumber-js";
import countryList from "react-select-country-list";

export const userValidator = async (state, userId:string) => {
  const apolloClient = initializeApollo();
  const {
    data: { userExists },
  } = await apolloClient.query({
    query: USER_EXISTS,
    variables: {
      userName: state.name,
      userId,
    },
  });

  if (userExists === true) {
    return {
      error: true,
      errMessage: "Username already exists",
    };
  } else if (
    +state.age <= 0 ||
    +state.age > 100 ||
    !Number.isInteger(+state.age)
  ) {
    return {
      error: true,
      errMessage: "Age is invalid",
    };
  } else if (
    isValidPhoneNumber(state.phone, countryList().getValue(state.country)) ===
    false
  ) {
    return {
      error: true,
      errMessage: "Phone is invalid",
    };
  } else if (state.artStyles.length > 5 || state.artStyles.length == 0) {
    return {
      error: true,
      errMessage: "Please enter no more than 5 Art Styles",
    };
  } else if (state.artKinds.length > 5 || state.artStyles.length == 0) {
    return {
      error: true,
      errMessage: "Please enter no more than 5 Art Kinds",
    };
  } else {
    return {
      error: null,
      errMessage: null,
    };
  }
};

export const UserValidate1 = async (state, userId:string) => {
  const apolloClient = initializeApollo();
  const {
    data: { userExists },
  } = await apolloClient.query({
    query: USER_EXISTS,
    variables: {
      userName: state.name,
      userId,
    },
  });

  if (userExists === true) {
    return {
      error: true,
      errMessage: "Username already exists",
    };
  } else if (
    +state.age <= 0 ||
    +state.age > 100 ||
    !Number.isInteger(+state.age)
  ) {
    return {
      error: true,
      errMessage: "Age is invalid",
    };
  } else if (
    isValidPhoneNumber(state.phone, countryList().getValue(state.country)) ===
    false
  ) {
    return {
      error: true,
      errMessage: "Phone is invalid",
    };
  } else {
    return {
      error: null,
      errMessage: null,
    };
  }
}

export const UserValidate2 = (state) => {
  if (state.artStyles.length > 5 || state.artStyles.length == 0) {
    return {
      error: true,
      errMessage: "Please enter no more than 5 Art Styles",
    };
  } else if (state.artKinds.length > 5 || state.artStyles.length == 0) {
    return {
      error: true,
      errMessage: "Please enter no more than 5 Art Kinds",
    };
  } else {
    return {
      error: null,
      errMessage: null,
    };
  }
}
