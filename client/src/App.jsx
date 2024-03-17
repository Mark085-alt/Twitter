import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authVerifyToken } from "./redux/slices/authSlice.js";
import { lazy, useEffect, Suspense } from "react"

const ProtectedRoutes = lazy(() => import("./components/ProtectedRoutes.jsx"));

// *********** Import pages ***************
// auth-page
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const VerifyOtp = lazy(() => import("./pages/auth/VerifyOtp"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ForgotChangePassword = lazy(() => import("./pages/auth/ForgotChangePassword"));


// pages
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const EditProfile = lazy(() => import("./pages/EditProfile.jsx"));
const Communities = lazy(() => import("./pages/Communities.jsx"));
const Premium = lazy(() => import("./pages/Premium.jsx"));
const Notification = lazy(() => import("./pages/Notification.jsx"));
const Explore = lazy(() => import("./pages/Explore.jsx"));
const List = lazy(() => import("./pages/List.jsx"));
const Messages = lazy(() => import("./pages/Messages.jsx"))
const Grok = lazy(() => import("./pages/Grok.jsx"))
const Chat = lazy(() => import("./pages/Chat.jsx"))
const PostPage = lazy(() => import("./pages/PostPage.jsx"));
const Bookmarks = lazy(() => import("./pages/Bookmarks.jsx"));


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    // Call the authentication verification function here
    dispatch(authVerifyToken());
  }, [dispatch]);


  return (
    <>
      <div className="flex justify-center items-center bg-black w-screen">
        <div className='h-screen w-full lg:w-10/12'>

          <Routes>
            {/* ***************AUTH*************** */}
            <Route path="/auth" >
              <Route path="login" element={<Suspense><Login /></Suspense>} />
              <Route path="signup" element={<Suspense><Signup /></Suspense>} />
              <Route path="forgot-password-email" element={<Suspense><ForgotPassword /></Suspense>} />
              <Route path="verify-otp" element={<Suspense><VerifyOtp /></Suspense>} />
              <Route path="forgot-password-change-password" element={<Suspense><ForgotChangePassword /></Suspense>} />
            </Route>

            {/* ****************** OTHER PROTECTED PAGES ************* */}
            <Route path="/" element={<Suspense><ProtectedRoutes /></Suspense>}>
              <Route path="" exact element={<Suspense><Home /></Suspense>} />
              <Route path="profile/:username" element={<Suspense><Profile /></Suspense>} />
              <Route path="edit-profile/:username" element={<Suspense><EditProfile /></Suspense>} />
              <Route path="post/:postId" element={<Suspense><PostPage /></Suspense>} />
              <Route path="explore" element={<Suspense><Explore /></Suspense>} />
              <Route path="lists" element={<Suspense><List /></Suspense>} />
              <Route path="messages" element={<Suspense><Messages /></Suspense>} />
              <Route path="notification" element={<Suspense><Notification /></Suspense>} />
              <Route path="communities" element={<Suspense><Communities /></Suspense>} />
              <Route path="bookmarks" element={<Suspense><Bookmarks /></Suspense>} />
              <Route path="premium" element={<Suspense><Premium /></Suspense>} />
              <Route path="grok" element={<Suspense><Grok /></Suspense>} />
              <Route path="chat/:chatId/:userName" element={<Suspense><Chat /></Suspense>} />
            </Route>

          </Routes>

        </div>
      </div >
    </>
  )
}

export default App;
