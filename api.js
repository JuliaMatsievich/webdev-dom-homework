//Документация к апи: https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/v2/%5Bkey%5D/comments/README.md


import { renderDate, renderComments } from './handlerComments.js';
import { removerLoading } from "./handlerLoading.js" ;
// import { inputName, inputComment } from "./variables.js";
// import { initialState } from './script.js'; 
// import { inputNameValue, inputCommentValue } from './handlerAddComments.js'

// export let comments = [];

const baseUrl = "https://wedev-api.sky.pro/api/v2/julia-matsievich";
const baseUrlApi = 'https://wedev-api.sky.pro/api';


// Функция запроса GET НЕавторизованного пользователя
export function fetchGet() {
	return fetch(`${baseUrl}/comments`, {
	method: 'GET',
})
.then(response => {
	if(response.status === 500) {
		throw new Error('Сервер сломался');
	}
	return response.json()
})
}


// Функция запроса GET авторизованного пользователя
export function fetchGetAuthoriz(token) {
	return fetch(`${baseUrl}/comments`, {
	method: 'GET',
	headers: {
		Authorization: token,
	},
})
.then(response => {
	if(response.status === 500) {
		throw new Error('Сервер сломался');
	}
	return response.json()
})
}

// Функция запроса POST
export const fetchPost = (newComment, token) => {
	return fetch(`${baseUrl}/comments`, {
		method: 'POST',
		body: JSON.stringify(newComment),
		headers: {
			Authorization: token,
		},
	})
		.then(response => {			
			if (response.status === 400) {
				throw new Error('Плохой запрос');
			}
			if (response.status === 500) {
				throw new Error('Сервер сломался');
			}
			return response.json();
		})
}

//Функция запроса на авторизацию
export function loginUser( { login, password} ) {
	return fetch(`${baseUrlApi}/user/login`, {
				method: 'POST',
				body: JSON.stringify({
					login,
					password
				}),
			})
			.then(response => {
				if (response.status === 400) {
					throw new Error('Неверный логин или пароль')
				}
				return response.json();
			})
}


//Функция запроса на удаление комментария
export function deleteComments({ token,id }) {
	console.log(`${baseUrl}/comments/` + id);
	return fetch(`${baseUrl}/comments/` + id, {
		method: 'DELETE',
		headers: {
			Authorization: token,
		},
	})
		.then((response) => {			
			// if (response.status === 400) {
			// 	throw new Error('код 400');
			// }
			// if (response.status === 500) {
			// 	throw new Error('код 500');
			// }
			return response.json();
		})
}