import React, { useState, useEffect } from 'react';
import { useParams ,useHistory} from 'react-router-dom';
import { getAllComments } from '../store/image';
import { useDispatch, useSelector} from 'react-redux';
import './Comment.css'


function Comment() {
    const {imageId} = useParams()
    const dispatch = useDispatch()

    const image = useSelector(state => state.images.all[imageId])
    const user = useSelector(state => state.session.user)
    const comments = useSelector(state => Object.values(state.images.all[imageId]?.comments))

    useEffect(() => {
        (async () => {
            await dispatch(getAllComments(imageId))
        })()
    }, [imageId])


    return (
        <div>
            {console.log("Image Id", imageId, "image", image)}
            <h4>this is the comments section</h4>
            <h1>{comments[0].commentBody}</h1>
        </div>
    )
}
export default Comment
