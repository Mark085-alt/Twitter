import React from 'react'
import Post from "../components/Post";

const ReplyPost = ({ post }) => {

    const commentPost = post.comment;
    const parentPost = post.parentPost;

    if (!commentPost || !parentPost) {
        return <></>
    }

    return (
        <div className='w-full bg-white/[0.09]'>
            <Post isdetailedPage={false} post={parentPost} />
            <Post isdetailedPage={false} post={commentPost} />
        </div>
    )
}

export default ReplyPost