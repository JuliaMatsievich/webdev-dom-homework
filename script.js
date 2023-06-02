import { fetchGet } from "./api.js";
import { listComments, autorizationButton, formBlock } from "./variables.js";
import { renderEnterForm, renderDate, renderComments } from "./render.js";
import { renderLoading,removerLoading } from "./handlerLoading.js" ;
import { handlerAddComment } from "./handlerAddComments.js";
import {initAutorizationEventListener} from "./eventlisteners.js";

//Начальное состояние формы
// export function initialState() {
// 	inputName.value = '';
// 	inputComment.value = '';
// 	formButton.disabled = true;
// 	formButton.classList.add('button-disabled');
// }
export let comments = [];
listComments.textContent = 'Подождите, пожалуйста, комментарии загружаются...';
// initialState();

export function fetchCommentsAndRender() {
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
			renderComments();
			removerLoading();
		})
		.catch(error => {
			if (error.message === 'код 500') {
				fetchCommentsAndRender();
			}
			console.log(error);
			alert('Кажется, у вас сломался интернет, попробуйте позже')
		})
}
fetchCommentsAndRender();

//Подписка на событие клика по кнопке "Написать"
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


initAutorizationEventListener();
