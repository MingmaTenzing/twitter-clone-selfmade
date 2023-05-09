import Image from "next/image";
import twitter from "../../../assests/twitter.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/init";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

type Props = {};
function Signup({}: Props) {
  const router = useRouter();
  const [Email, setEmail] = useState<string>();
  const [Password, setPassword] = useState<string>();
  const [emilAlreadyinUse, setEmailAlreadyinUse] = useState<boolean>(false);

  function signupUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, Email!, Password!)
      .then((user) => {
        router.push("/createprofile");
      })
      .catch((error) => {
        console.error(error.code);
        if (error.code === "auth/email-already-in-use") {
          setEmailAlreadyinUse(true);
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
    <div className="p-4 md:mt-10 md:w-[500px] m-auto">
      <div className="flex  flex-col items-center space-y-4">
        <Image
          src={twitter}
          alt="twitter logo"
          width={200}
          height={200}
          className="w-20"
        />

        <h1 className="text-2xl font-bold ">Join Tweety Today</h1>
      </div>
      <form onSubmit={signupUser} className="mt-10">
        <h2 className="font-bold text-lg text-center">Create your account</h2>

        <div className="mt-8 space-y-8">
          <div className="  space-y-1">
            {emilAlreadyinUse && (
              <h3 className="text-red-500  text-sm font-lig">
                Email Already in Use
              </h3>
            )}

            <input
              type="email"
              required
              className="border p-3 outline-none w-full"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="">
            <input
              minLength={8}
              required
              type="password"
              className="border p-3 outline-none w-full"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
        </div>

        <button
          type="submit"
          className="text-white  mt-4 bg-black px-4 py-2 rounded-full"
        >
          Next
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-center"> Already have an account? <Link href="/login" className="text-twitter">Log In</Link> </h3>
      </div>
    </div>
    </>
  );
}
export default Signup;
