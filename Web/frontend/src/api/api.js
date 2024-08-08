import axios from 'axios';

const API_URL = 'http://localhost:5002/api';  // 確保這裡的URL是正確的

export const uploadImage = async (imageUrl, category) => {
  try {
    const response = await axios.post(`${API_URL}/upload`, { imageUrl, category });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getImages = async () => {
  try {
    const response = await axios.get(`${API_URL}/images`);
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};
