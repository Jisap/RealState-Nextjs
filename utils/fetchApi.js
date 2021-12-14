import axios from 'axios';

export const baseUrl = 'https://bayut.p.rapidapi.com'

export const fetchApi = async ( url ) => {

    const { data } = await axios.get(( url), { 
       headers: {
        'x-rapidapi-host': 'bayut.p.rapidapi.com',
        'x-rapidapi-key': '51befa78e9mshf61f58c4a3515fbp1fb1efjsn450cc588b1e8'
       } 
    });

    return data
}