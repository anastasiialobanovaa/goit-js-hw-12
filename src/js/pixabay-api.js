import axios from 'axios';

const API_KEY = '56131780-53206f25f9992fd25cf079e43'; // Не забудь вставить свой ключ!
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  const response = await axios.get('', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 15, // Строго 15 элементов по ТЗ
    },
  });

  return response.data;
}
