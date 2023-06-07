import { fetchGet, fetchGetAuthoriz } from "./api.js";
// import { listComments, formBlock } from "./variables.js";
 import {renderDate, renderComments} from "./render.js";
import { renderLoading,removerLoading } from "./handlerLoading.js" ;
import { handlerAddComment } from "./handlerAddComments.js";
import { renderLoginComponent } from './login-component.js';


//Начальное состояние формы
// export function initialState() {
// 	inputName.value = '';
// 	inputComment.value = '';
// 	formButton.disabled = true;
// 	formButton.classList.add('button-disabled');
// }
export let comments = [];

let token = null;

// container.textContent = 'Подождите, пожалуйста, комментарии загружаются...';

// initialState();


export const fetchCommentsAndRender = (listComments) => {
	return fetchGet()
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
			renderComments(listComments);
			removerLoading();
		})
		.catch(error => {
			if (error.message === 'код 500') {
				fetchCommentsAndRender(listComments);
			}
			console.log(error);
			alert('Кажется, у вас сломался интернет, попробуйте позже')
		})
}


export const fetchCommentsAndRenderAuthoriz = (listComments,token) => {
	return fetchGetAuthoriz(token)
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
			renderComments(listComments);
			removerLoading();
		})
		.catch(error => {
			if (error.message === 'код 500') {
				fetchCommentsAndRenderAuthoriz(listComments, token);
			}
			console.log(error);
			alert('Кажется, у вас сломался интернет, попробуйте позже')
		})
}


// fetchCommentsAndRender();
// renderInitialState();


function renderApp() {
	const listComments = document.querySelector('.comments');
	const formBlock = document.querySelector('.form');
	listComments.textContent = 'Подождите, пожалуйста, комментарии загружаются...';
	if(!token) {

		renderLoginComponent({
			listComments,
			formBlock,
			setToken: (newToken) => {
				token = newToken;
			},
			fetchCommentsAndRenderAuthoriz})	
	} else {
		fetchCommentsAndRenderAuthoriz(listComments,token);
	}
}

renderApp();

// Подписка на событие клика по кнопке "Написать"
// formButton.addEventListener('click', handlerAddComment);

//Подписка на создание комментария нажатием клавиши Enter
// form.addEventListener('keyup', (event) => {
// 	if (event.key === 'Enter') {
// 		handlerAddComment();
// 	}
// });

//Подписка на активность/неактивность кнопки "Написать"
// form.addEventListener('input', () => {
// 	if (inputName.value && inputComment.value) {
// 		formButton.disabled = false;
// 		formButton.classList.remove('button-disabled')
// 	} else {
// 		formButton.disabled = true;
// 		formButton.classList.add('button-disabled')
// 	}
// })
