import React, { useState } from 'react';
import { uploadImage, getImages } from './api/api';

const ImageUpload = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);

  const handleUpload = async () => {
    try {
      const newImage = await uploadImage(imageUrl, category);
      setImages([...images, newImage]);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const fetchedImages = await getImages();
      setImages(fetchedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
    <div>
      <h1>Image Upload</h1>
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={fetchImages}>Fetch Images</button>
      <div>
        {images.map((image) => (
          <div key={image._id}>
            <img src={image.imageUrl} alt={image.category} />
            <p>{image.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
