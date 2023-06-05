import { renderDate, renderComments } from './render.js';
import { removerLoading } from "./handlerLoading.js" ;
// import { inputName, inputComment } from "./variables.js";
// import { initialState } from './script.js'; 
// import { inputNameValue, inputCommentValue } from './handlerAddComments.js'

// export let comments = [];

const baseUrl = "https://wedev-api.sky.pro/api/v2/julia-matsievich";
const baseUrlApi = 'https://wedev-api.sky.pro/api';


// Функция запроса GET
export function fetchGet() {
	return fetch(`${baseUrl}/comments`, {
	method: 'GET'
})
.then(response => {
	if(response.status === 500) {
		throw new Error('код 500');
	}
	return response.json()
})
}


// // Функция запроса GET
// export function fetchGet() {
// 		fetch(`${baseUrl}/comments`, {
// 		method: 'GET'
// 	})
// 	.then(response => {
// 		if(response.status === 500) {
// 			throw new Error('код 500');
// 		}
// 		return response.json()
// 	})
// 	.then(responseData => {
// 			let appcomments = responseData.comments.map((comment) => {
// 				return {
// 					name: comment.author.name,
// 					date: renderDate(comment.date),
// 					text: comment.text,
// 					likes: comment.likes,
// 					isLiked: false,
// 					forceError: true
// 				}
// 			})
// 			comments = appcomments;
// 			renderComments();
// 			removerLoading();
// 		})
// 		.catch(error => {
// 			if(error.message === 'код 500') {
// 				fetchGet();
// 			}
// 			console.log(error);
// 			alert('Кажется, у вас сломался интернет, попробуйте позже')
// 		})
// }



// Функция запроса POST
// export const fetchPost = (newComment) => {
// 	fetch(`${baseUrl}/comments`, {
// 		method: 'POST',
// 		body: JSON.stringify(newComment)
// 	})
// 		.then(response => {
// 			if (response.status === 400) {
// 				throw new Error('код 400');
// 			}
// 			if (response.status === 500) {
// 				throw new Error('код 500');
// 			}
// 			return response.json();
// 		})
// 		.then(responseData => {
// 			comments = responseData.comments;
// 			fetchGet()
// 		})
// 		.catch(error => {
// 			removerLoading();
// 			inputName.value = inputNameValue;
// 			inputComment.value = inputCommentValue;
// 			if (error.message === 'код 400') {
// 				alert('Имя и комментарий должны быть не менее 3х символов');
// 				return;
// 			}
// 			if (error.message === 'код 500') {
// 				fetchPost(newComment);
// 				initialState();
// 			} else {
// 				alert('Кажется, у вас сломался интернет, попробуйте позже')
// 				console.log(error);
// 			}
// 		})
// }

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