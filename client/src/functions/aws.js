import axios from "axios"

export const uploadImage = async (img, access_token) => {
    try {
        const formData = new FormData()
        formData.append('image', img)

        const response = await axios.post(
            `/api/v1/blogs/upload-file`,
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        )

        if (response && response.data && response.data.imageUrl) {
            return response.data.imageUrl
        } else {
            throw new Error('No image URL returned from server')
        }
    } catch (error) {
        console.error('Upload error:', error)
        throw error
    }
}
