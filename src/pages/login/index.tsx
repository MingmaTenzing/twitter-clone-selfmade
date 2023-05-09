import Image from "next/image";
import twitter from "../../../assests/twitter.png";
import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase/init";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../../utils/hooks";
import { login } from "../../../slices/userSlice";
import { log } from "console";
import { user } from "../createprofile";
import Link from "next/link";
import Head from "next/head";

type Props = {};
function SigninUser({}: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [wrongPassword, setWrongPassword] = useState<boolean>(false);
  const [wrongEmail, setWrongEmail] = useState<boolean>(false);
  const [Email, setEmail] = useState<string>();
  const [Password, setPassword] = useState<string>();

  function loginUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    signInWithEmailAndPassword(auth, Email!, Password!)
      .then((userCredential) => {
        router.push("/");
      })
      .catch((error) => {
        console.log(error.code);
        if (error.code === "auth/wrong-password") {
          setWrongPassword(true);
        }
        if (error.code === "auth/user-not-found") {
          setWrongEmail(true);
        }
      });
  }
  return (
    <>
    <Head>
        <title>Log In</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
   
    <div className="p-4 md:w-[500px] m-auto md:mt-10">
      <div className="flex  flex-col items-center space-y-4">
        <Image
          src={twitter}
          alt="twitter logo"
          width={200}
          height={200}
          className="w-20"
        />

        <h1 className="text-2xl font-bold text-center ">Sign in to your Tweety Account</h1>
      </div>
      <form onSubmit={loginUser} className="mt-10">
        <h2 className="font-bold text-lg">Login</h2>
        <div className="mt-8 space-y-8">
          <div className=" space-y-1">
            {wrongEmail && (
              <h3 className="text-red-500 text-sm">Wrong Email Address</h3>
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
            {wrongPassword && (
              <h3 className="text-red-500 text-sm">Incorrect Password</h3>
            )}
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
          Log In
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-center">
          {" "}
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-twitter">
            Signup
          </Link>{" "}
        </h3>
      </div>
    </div>
    </>
  );
}
export default SigninUser;
