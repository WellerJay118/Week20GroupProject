const ADD_IMAGE = 'images/ADD'
const GET_FOLLOWING = 'images/GET_FOLLOWING'
const GET_EXPLORE = 'images/GET_EXPLORE'
const GET_IMAGE = 'images/GET_IMAGE'
const DELETE_IMAGE = 'images/DELETE_IMAGE'
const ADD_LIKE = 'images/ADD_LIKE'
const REMOVE_LIKE = 'images/REMOVE_LIKE'
const GET_COMMENTS = 'images/GET_COMMENTS'
const ADD_COMMENT = 'images/ADD_COMMENT'
const EDIT_COMMENT = 'images/EDIT_COMMENT'
const REMOVE_COMMENT = 'images/REMOVE_COMMENT'

const delComment = (commentId, imageId) => ({
    type: REMOVE_COMMENT,
    payload: {
        commentId,
        imageId
    }
})

export const deleteComment = (commentId, imageId) => async(dispatch) => {
    const res = await fetch(`/api/images/${imageId}/comments/${commentId}`, {
        method: "DELETE"
    })
    if(res.ok) {
        dispatch(delComment(commentId, imageId))
    }
}

const editComment = (comment) => ({
    type: EDIT_COMMENT,
        comment
})

export const editAComment = (commentBody, commentId, imageId) => async(dispatch) => {
    const res = await fetch(`/api/images/${imageId}/comments/${commentId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({commentBody})
    })
    const edittedComment = await res.json()
    dispatch(editComment(edittedComment))
}

const addComment = (comment, imageId) => ({
    type: ADD_COMMENT,
    payload: {
        comment,
        imageId
    }
})

export const addNewComment = (comment, imageId) => async(dispatch) => {
    const res = await fetch(`/api/images/${imageId}/comments/add`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify(comment)
    })
    const newComment = await res.json()
    dispatch(addComment(newComment, imageId))
}

const getComments = (comments) => ({
    type: GET_COMMENTS,
    comments
})

export const getAllComments = (imageId) => async(dispatch) => {
    const res = await fetch(`/api/images/${imageId}/comments`)
    const comments = await res.json()
    dispatch(getComments(comments))
    return comments
}

const addImage = (image) => ({
    type: ADD_IMAGE,
    image
})

export const addNewImage = (imagePayload) => async(dispatch) => {
    const res = await fetch('/api/images/add', {
        method:"POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify(imagePayload)
    })
    const image = await res.json()
    dispatch(addImage(image))
    return image
}

const getImage = (image) => ({
type: GET_IMAGE,
image,
})

const deleteImage = (imageId) => ({
type: DELETE_IMAGE,
imageId
})

const addLike = (imageId, userId) => ({
    type: ADD_LIKE,
    payload: {
        imageId, userId
    }
})

const removeLike = (imageId, userId) => ({
    type: REMOVE_LIKE,
    payload: {
        imageId, userId
    }
})

export const postLike = (imageId, userId) => async(dispatch) => {
    const res = await fetch(`/api/images/${imageId}/like`)
    if (res.ok){
        dispatch(addLike(imageId, userId))
    }
}

export const destroyLike = (imageId, userId) => async(dispatch) => {
    const res = await fetch(`/api/images/${imageId}/unlike`)
    if (res.ok){
        dispatch(removeLike(imageId, userId))
    }
    return
}

export const destroyImage = (imageId) => async(dispatch) => {
    await fetch(`/api/images/${imageId}`,
    {
        method: 'DELETE'
    })
    dispatch(deleteImage(imageId))
    return
}

export const fetchImage = (imageId) => async (dispatch) => {
    const res = await fetch(`/api/images/${imageId}`)
    const image = await res.json()
    dispatch(getImage(image))
    return image
}

export const patchCaption = (caption, imageId) => async(dispatch) => {
    const res = await fetch(`/api/images/${imageId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({caption})
    })
    if (res.ok) {
        const image = await res.json()
        dispatch(getImage(image))
        return image
    }
}

const getFollowing = (images) => ({
    type: GET_FOLLOWING,
    images,
})

const getNotFollowing = (images) => ({
    type: GET_EXPLORE,
    images
})
export const getFollow = () => async (dispatch) => {
    const res = await fetch('/api/images/following')
    const images = await res.json()
    dispatch(getFollowing(images))
    return images
}

export const getExplore = () => async (dispatch) => {
    const res = await fetch('/api/images/explore')
    const exploreImages = await res.json()
    dispatch(getNotFollowing(exploreImages))
    return exploreImages
}

const initialState = { all:{}, following: {}, notFollowing: {}}
const imageReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case GET_FOLLOWING:
            Object.values(action.images).forEach(image => {
                newState.following[image.id] = image
                newState.all[image.id] = image
            })
            return newState
        case GET_EXPLORE:
            Object.values(action.images).forEach(image => {
                newState.notFollowing[image.id] = image
                newState.all[image.id] = image
            })
            return newState
        case GET_IMAGE:
            newState.all[action.image.id] = action.image
            return newState
        case ADD_IMAGE:
            newState[action.image.id] = action.image
            return newState
        case DELETE_IMAGE:
            delete newState.all[action.imageId]
            return newState
        case ADD_LIKE:
            const imageId = action.payload.imageId
            const userId = action.payload.userId
            newState.all[imageId].likes[userId] = { imageId, userId}
            return newState
        case REMOVE_LIKE:
            const imageId2 = action.payload.imageId
            const userId2 = action.payload.userId
            delete newState.all[imageId2].likes[userId2]
            return newState
        case GET_COMMENTS:
            Object.values(action.comments).forEach(comment => {
                const commentImgId = comment.imageId
                newState.all[commentImgId].comments[comment.id] = comment
            })
            return newState
        case ADD_COMMENT:
            newState.all[action.payload.imageId].comments[action.payload.comment.id] = action.payload.comment
            return newState
        case EDIT_COMMENT:
            newState.all[action.comment.imageId].comments[action.comment.id] = action.comment
            return newState
        case REMOVE_COMMENT:
            delete newState.all[action.payload.imageId].comments[action.payload.commentId]
            return newState
        default: return state
    }
}
export default imageReducer
