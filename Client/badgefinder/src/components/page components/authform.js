import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./usercontext";
import axios from "./axiosInstance";
import * as Yup from "yup";
import "../../index.css";
const { logger } = require("../logger");

const inputStyles = {
  borderRadius: "full",
  borderColor: "gray.400",
  fontSize: "xl",
  color: "white",
  px: 6,
  py: 3,
};

const labelStyles = {
  color: "white",
  fontWeight: "medium",
  fontSize: "lg",
};

const InputField = ({
  name,
  label,
  type,
  value,
  onChange,
  error,
  validationSchema,
  setErrors,
}) => {
  const handleBlur = useCallback(() => {
    validationSchema
      .validateAt(name, { [name]: value })
      .then(() => setErrors((prevErrors) => ({ ...prevErrors, [name]: false })))
      .catch((error) =>
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }))
      );
  }, [name, value, validationSchema, setErrors]);

  return (
    <FormControl isRequired isInvalid={Boolean(error)} mb={5}>
      <FormLabel htmlFor={name} sx={labelStyles}>
        {label}
      </FormLabel>
      <Input
        placeholder={label}
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        sx={inputStyles}
        size="lg"
        onBlur={handleBlur}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

const formConfig = {
  signup: {
    fields: [
      { name: "firstName", label: "First Name", type: "text" },
      { name: "lastName", label: "Last Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "membershipNumber", label: "Membership Number", type: "number" },
    ],
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      membershipNumber: Yup.number().required("Membership number is required"),
    }),
  },
  signin: {
    fields: [
      { name: "username", label: "Username", type: "text" },
      { name: "password", label: "Password", type: "password" },
    ],
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
  },
  signupSecondary: {
    fields: [
      { name: "username", label: "Enter a Username", type: "text" },
      { name: "password", label: "Enter a Password", type: "password" },
    ],
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
  },
};

const AuthForm = ({ formType, onSignInSuccess }) => {
  if (!formConfig[formType]) {
    throw new Error(`Unknown formType: ${formType}`);
  }

  const config = formConfig[formType] || {};
  if (!(config?.fields)) {
    throw new Error(`Invalid config for formType: ${formType}`);
  }
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    logger.info("User context updated: ", user);
  }, [user]);

  useEffect(() => {
    logger.info("User data on render:", user);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitted(true);

    try {
      let endpoint =
        formType === "signupSecondary"
          ? "/auth/signup-secondary"
          : `/auth/${formType}`;
      let data = formData;

      if (formType === "signupSecondary") {
        if (!user?._id) {
          throw new Error("User data is not available yet.");
        }
        data = { ...formData, _id: user._id };
      }

      const response = await axios.post(endpoint, data);

      logger.info("User from context:", user); 

      if (response.status === 200) {
        if (formType === "signup") {
          logger.info("Received user data from signup: ", response.data.user);
          setUser(response.data.user);
          logger.info("User data from response:", response.data.user); 
          navigate("/auth/signup-secondary", {
            state: { initialSignupEmail: formData.email },
          });
        } else {
          setUser(response.data.user);
          navigate("/home");
          onSignInSuccess?.(response.data.user); 
        }
      }
    } catch (error) {
      if (error.response?.data.errors) {
        const validationErrors = error.response.data.errors;
        setErrors(validationErrors);
        setErrorMessage("");
      } else if (error.response?.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        logger.error("There was an error!", error);
        setErrorMessage("An error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  let buttonText = "Sign In";
  if (isLoading) {
    buttonText = <Spinner color="white" />;
  } else if (formType === "signup") {
    buttonText = "Sign Up";
  }

  return (
    <VStack className="container" align="center" mt={10}>
      <form onSubmit={handleSubmit}>
        {config.fields.map((field) => (
          <InputField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            value={formData[field.name] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            error={errors[field.name]}
            validationSchema={config.validationSchema}
            errors={errors}
            setErrors={setErrors}
          />
        ))}
        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          colorScheme="teal"
          width="full"
          justifyContent="center"
        >
          {buttonText}
        </Button>
      </form>
      {formType === "signup" ? (
        <span style={{ color: "white" }}>
          Already have an account?&nbsp;
          <Link to="/signin" style={{ textDecoration: "underline" }}>
            Sign in
          </Link>
        </span>
      ) : (
        <span style={{ color: "white" }}>
          Don't have an account?&nbsp;
          <Link to="/signup" style={{ textDecoration: "underline" }}>
            Sign up
          </Link>
        </span>
      )}
      {isSubmitted && errorMessage && (
        <span style={{ color: "red" }}>{errorMessage}</span>
      )}
    </VStack>
  );
};

export default AuthForm;
