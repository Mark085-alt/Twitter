import React, { useEffect, useState } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post.jsx";
import ReplyPost from "./ReplyPost.jsx";
import PostSkeleton from '../components/common/PostSkeleton.jsx';
import {
    getUserPosts,
    getUserReplies,
    getUserMediaPosts,
    getUserLikePosts
} from "../services/postService.js";



const InfinitePosts = ({ option, userName }) => {

    const [isloading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [index, setIndex] = useState(0);
    const [postData, setPostData] = useState([]);
    const [repliesData, setRepliesData] = useState([]);


    useEffect(() => {
        setHasMore(true);
        setPostData([]);
        fetchData([], 0);
        setRepliesData([])
    }, [option, userName]);


    const fetchData = async (currentPostData, currentIndex) => {

        let func;

        switch (option.title) {

            case "Posts":
                func = getUserPosts;
                break;

            case "Replies":
                func = getUserReplies;
                break;

            case "Media":
                func = getUserMediaPosts;
                break;

            case "Likes":
                func = getUserLikePosts;
                break;

            default:
                func = getUserPosts;
                break;
        }

        setIsLoading(true);

        await func(userName, currentIndex)
            .then(({ data }) => {
                if (option.title === "Replies") {
                    setRepliesData([...currentPostData, ...data.data]);
                } else {
                    setPostData([...currentPostData, ...data.data]);
                }
                setIndex(currentIndex + 1);
                data?.data?.length === 10 ? setHasMore(true) : setHasMore(false);
            })
            .catch((err) => console.log("ERROR : ", err))
            .finally(() => {
                setIsLoading(false)
            });
    }



    return (
        <div className='w-full'>
            {
                isloading ? (
                    <div className='flex flex-col justify-normal items-start gap-2'>
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                    </div>
                ) : (

                    (postData.length > 0 || repliesData.length > 0) ? (
                        <>
                            <InfiniteScroll
                                dataLength={postData.length}
                                next={() => fetchData(postData, index)}
                                hasMore={hasMore}
                            >
                                <div className='flex flex-col gap-5 justify-start '>
                                    {
                                        option.title === "Replies" ? (
                                            repliesData.map((post, index) => (
                                                <div key={post?._id + "" + index}>
                                                    <ReplyPost post={post} />
                                                </div>
                                            ))
                                        ) : (
                                            postData.map((post, index) => (
                                                <div key={post?._id + "" + index}>

                                                    <Post post={post} />
                                                </div>
                                            )))
                                    }
                                </div>
                            </InfiniteScroll>
                        </>
                    ) : (
                        <div className='w-full mt-10 mb-20'>
                            <p className='text-3xl font-bold text-center'>
                                No post found
                            </p>
                        </div>
                    )
                )
            }
        </div>
    );

}

export default InfinitePosts