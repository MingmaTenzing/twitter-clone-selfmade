import Nav from "../../components/Nav";
import Post from "../../utils/Post";
import { FormEvent, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase/init";
import { Comment, tweet } from "../../components/Feed";
import Comments from "../../utils/Comments";
import profile from "../../assests/profile.jpg";
import Twitter from "../../assests/twitter.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import PostLoading from "../../components/PostLoading";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";

type Props = {};
function Tweet({}: Props) {
  const [Tweet, setTweet] = useState<tweet>();
  const [Reply, setReply] = useState<string>();
  const [comments, setComments] = useState<Comment[]>();
  const [commentadded, setcommentAdded] = useState<boolean>(false);
  const [postId, setpostId] = useState<string>();
  const router = useRouter();
  const user = useAppSelector((state) => state.user.value);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  useEffect(() => {
    if (router.isReady) {
      const postId = Array.isArray(router.query.postId)
        ? router.query.postId.join(",")
        : router.query.postId;
      setpostId(postId);
    }
  }, [router.isReady]);

  useEffect(() => {
    async function getPost() {
      const docRef = doc(db, "posts", `${postId}`);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      if (data) {
        setTweet({
          date: data.date,
          image: data.image,
          tweetText: data.tweetText,
          uid: data.uid,
          userEmail: data.userEmail,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          id: data.id,
        });
      }
    }

    getPost();
  }, [postId]);

  useEffect(() => {
    async function getComments() {
      if (postId) {
        const commentsRef = query(
          collection(db, "comments"),
          where("postId", "==", postId)
        );
        const { docs } = await getDocs(commentsRef);
        const data: any = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setComments(data);
      }
    }
    getComments();
  }, [commentadded, postId]);

  async function sendReply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const comment = {
      commentText: Reply,
      postId: postId,
      date: new Date().toString(),
      userName: user.displayName,
      userEmail: user.email,
      userPhoto: user.photoURL,
    };

    try {
      await addDoc(collection(db, "comments"), comment);
      setcommentAdded(!commentadded);
      toast.success("Comment added successfully");
      setReply("");
    } catch (e) {
      console.error("Error posting comment:", e);
    }
  }
  return (
    <main className="flex bg-black text-white">
      <Toaster />
      <Head>
        <title>{Tweet?.userName}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />

      <div className="md:border-r   ">
        <div className="flex space-x-2 p-4">
          <ArrowLeftIcon
            onClick={() => router.push("/")}
            className="w-4 md:w-6"
          />
          <h2 className="font-bold md:text-xl">Tweet</h2>
        </div>
        {!Tweet ? <PostLoading /> : <Post tweet={Tweet} />}

        <div className="flex items-center p-2 md:p-4 md:space-x-5 space-x-4 border-y    bg-black text-white">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="profile"
              width={200}
              height={200}
              className="w-[40px] h-[40px]  object-cover object-center rounded-full"
            />
          ) : (
            <Image
              src={Twitter}
              alt="profile"
              width={200}
              height={200}
              className="w-[40px] h-[40px]  object-cover object-center rounded-full"
            />
          )}

          <form onSubmit={sendReply} className="md:space-x-4">
            <input
              type="text"
              onChange={(e) => setReply(e.target.value)}
              value={Reply}
              className=" text-sm md:text-base outline-none  w-[200px] md:w-[360px] md:p-4 bg-black text-white "
              placeholder="Enter your reply"
            ></input>
            {!user.uid ? (
              <button
                type="submit"
                disabled
                className=" bg-twitter opacity-40  cursor-not-allowed text-white rounded-full font-semibold px-3 md:px-5 py-2"
              >
                Reply
              </button>
            ) : (
              <button
                type="submit"
                className=" bg-twitter text-white rounded-full font-semibold px-3 md:px-5 py-2"
              >
                Reply
              </button>
            )}
          </form>
        </div>

        {/**  LOADING SKELETON*/}

        {/** COMMENTS SECTION */}

        {comments?.map((comment) => (
          <Comments comment={comment} key={comment.id} />
        ))}
      </div>

      {!user.uid && (
        <div className=" flex  justify-center items-center   fixed left-0 bottom-0 w-full h-[60px] bg-black">
          <p className=" font-semibold text-white">
            Log in and start Tweeting?{" "}
            <span
              className="  text-twitter  cursor-pointer"
              onClick={() => router.push("/login")}
            >
              {" "}
              Sign In
            </span>
          </p>
        </div>
      )}
    </main>
  );
}
export default Tweet;
