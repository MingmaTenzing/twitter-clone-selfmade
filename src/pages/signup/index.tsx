import Image from "next/image";
import twitter from "../../../assests/twitter.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/init";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import x from "../../../assests/X_logo_2023_(white).png";
import Google from "../../../assests/google.png";
import Apple from "../../../assests/apple.png";
import { TextField } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {};
function Signup({}: Props) {
  const router = useRouter();
  const [Email, setEmail] = useState<string>();
  const [weakPassword, setWeakPassword] = useState<boolean>(false);
  const [Password, setPassword] = useState<string>();
  const [emilAlreadyinUse, setEmailAlreadyinUse] = useState<boolean>(false);
  function signupUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, Email!, Password!)
      .then(() => {
        router.push("/createprofile");
      })
      .catch((error) => {
        console.error(error.code);
        if (error.code === "auth/email-already-in-use") {
          setEmailAlreadyinUse(true);
        }
        if (error.code === "auth/weak-password") {
          setWeakPassword(true);
        }
      });
  }

  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className=" p-8 bg-black w-full  h-[100vh] md:overflow-hidden m:auto text-white ">
        <div className="   bg-black  text-white  p-6  md:w-1/2 md:m-auto lg:w-1/3 flex-col items-center  h-full ">
          <div className="  space-y-8 flex flex-col justify-center h-full ">
            <div className=" flex justify-center">
              <Image src={x} alt="x logo" className="w-8 " />
            </div>
            <p className=" font-bold text-2xl"> Sign Up with X</p>
            <button
              disabled
              className=" w-full bg-white flex justify-center items-center py-3 rounded-full space-x-3 "
            >
              <Image src={Google} alt="google" className=" w-6" />
              <span className=" text-gray-500 text-sm font-semibold">
                Sign up with Google
              </span>
            </button>
            <button
              disabled
              className=" w-full bg-white flex justify-center items-center py-3 rounded-full space-x-3 "
            >
              <Image src={Apple} alt="google" className=" w-6" />
              <span className=" text-gray-500 text-sm font-semibold">
                Sign up with Apple
              </span>
            </button>
            <div className=" flex items-center ">
              <div className=" w-full h-[0.5px] border"></div>
              <p className=" mx-2">or</p>
              <div className=" w-full h-[0.5px] border"></div>
            </div>
            <form
              className=" flex flex-col justify-center"
              onSubmit={signupUser}
            >
              <TextField
                id="outlined-basic"
                label="Email Address"
                required
                type="email"
                variant="outlined"
                sx={{
                  fieldset: {
                    borderColor: "#242424",
                  },
                  input: { color: "white" },
                  label: { color: "#242424" },
                  borderColor: "white",
                  border: { color: "white" },
                  backgroundColor: { color: "black" },
                }}
                error={emilAlreadyinUse}
                onChange={(e) => setEmail(e.target.value)}
                helperText="Email Already in Use"
              />
              <TextField
                id="outlined-basic"
                label="Password"
                required
                variant="outlined"
                sx={{
                  fieldset: { borderColor: "#242424" },
                  input: { color: "white" },
                  label: { color: "#242424" },
                  borderColor: "white",
                  border: { color: "white" },
                }}
                error={weakPassword}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Weak Password (Tip: Min 8 Characters with symbols) "
              />
              <div>
                <button
                  type="submit"
                  className=" w-full h-12 font-semibold rounded-full text-white bg-twitter"
                >
                  {" "}
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
export default Signup;
