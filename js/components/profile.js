import { isLocalhost, getUrlParameter } from '../utils';

const isInChaordicEnvironment = ~window.location.host.indexOf('busca.');
const endpoint = `${
  isInChaordicEnvironment ? 'https://www.mariafilo.com.br' : ''
}/no-cache/profileSystem/getProfile`;

export async function getProfile() {
  try {

    const response = await fetch(endpoint);

    if (!response.ok) throw new Error(response);

    const profile = await response.json();

    return Promise.resolve(profile);
  } catch (error) {
    return Promise.reject(error);
  }
}
