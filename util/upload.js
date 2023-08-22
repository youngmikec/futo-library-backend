import cloudinary from '../config/cloudinary.js';
const module = 'Upload'

export const uploadImage = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: 'chinos-images'
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        return result;
    } catch (error) {
        throw new Error(`${module} Error! Try uploading another image`);
    }

    // let result;
    // cloudinary.uploader.upload(image, {
    //     folder: 'chinos_images'
    // }).then(res => {
    //     console.log('response', res)
    //     result = res;
    // }).catch(err => {
    //     throw new Error(`${err.message}`)
    // })
}