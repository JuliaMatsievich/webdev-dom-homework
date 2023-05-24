import { renderDate, renderComments } from './render.js';
import { removerLoading } from "./handlerLoading.js" ;
import { inputName, inputComment } from "./variables.js";
import { initialState, inputNameValue, inputCommentValue } from './script.js'; 

export let comments = [];


// Функция запроса GET
export function fetchGet() {
		fetch('https://webdev-hw-api.vercel.app/api/v1/julia-matsievich/comments', {
		method: 'GET'
	})
	.then(response => {
		if(response.status === 500) {
			throw new Error('код 500');
		}
		return response.json()
	})
.then(responseData => {
			let appcomments = responseData.comments.map((comment) => {
				return {
					name: comment.author.name,
					date: renderDate(comment.date),
					text: comment.text,
					likes: comment.likes,
					isLiked: false,
					forceError: true
				}
			})
			comments = appcomments;
			renderComments();
			removerLoading();
		})
		.catch(error => {
			if(error.message === 'код 500') {
				fetchGet();
			}
			console.log(error);
			alert('Кажется, у вас сломался интернет, попробуйте позже')
		})
	// return fetch('https://webdev-hw-api.vercel.app/api/v1/julia-matsievich/comments', {
	// 	method: 'GET'
	// })
	// 	.then(response => {
	// 		if (response.status === 500) {
	// 			throw new Error('код 500');
	// 		}
	// 		return response.json()
	// 	})
	// 	.catch(error => {
	// 		if (error.message === 'код 500') {
	// 			fetchGet();
	// 		}
	// 		alert('Кажется, у вас сломался интернет, попробуйте позже')
	// 	})
}



// Функция запроса POST
export const fetchPost = (newComment) => {
	fetch('https://webdev-hw-api.vercel.app/api/v1/julia-matsievich/comments', {
		method: 'POST',
		body: JSON.stringify(newComment)
	})
		.then(response => {
			if (response.status === 400) {
				throw new Error('код 400');
			}
			if (response.status === 500) {
				throw new Error('код 500');
			}
			return response.json();
		})
		.then(responseData => {
			comments = responseData.comments;
			fetchGet()
		})
		.catch(error => {
			removerLoading();
			inputName.value = inputNameValue;
			inputComment.value = inputCommentValue;
			if (error.message === 'код 400') {
				alert('Имя и комментарий должны быть не менее 3х символов');
				return;
			}
			if (error.message === 'код 500') {
				fetchPost(newComment);
				initialState();
			} else {
				alert('Кажется, у вас сломался интернет, попробуйте позже')
				console.log(error);
			}
		})
}

