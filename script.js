import { fetchGet, fetchGetAuthoriz, fetchPost } from "./api.js";
import { renderDate, renderComments, renderCommentsAuthoriz  } from "./handlerComments.js";
import { renderLoading, removerLoading } from "./handlerLoading.js";
import { renderLoginComponent } from './login-component.js';

export let comments = [];

let token = null;

export const fetchCommentsAndRender = (listComments) => {
	return fetchGet()
		.then(responseData => {
			let appcomments = responseData.comments.map((comment) => {
				return {
					id: comment.id,					
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
			if (error.message === 'Сервер сломался') {
				fetchCommentsAndRender(listComments);
			}
			console.log(error);
			alert('Кажется, у вас сломался интернет, попробуйте позже')
		})
}

export const fetchCommentsAndRenderAuthoriz = (listComments) => {
	return fetchGetAuthoriz(token)
		.then(responseData => {
			let appcomments = responseData.comments.map((comment) => {
				return {
					id: comment.id,
					name: comment.author.name,
					date: renderDate(comment.date),
					text: comment.text,
					likes: comment.likes,
					isLiked: false,
					forceError: true
				}
			})
			comments = appcomments;
			renderCommentsAuthoriz(listComments,token)
			removerLoading();
		})
		.catch(error => {
			if (error.message === 'Сервер сломался') {
				fetchCommentsAndRenderAuthoriz(listComments);
			}
			console.log(error);
			alert('Кажется, у вас сломался интернет, попробуйте позже')
		})
}

export function fetchPostandRender(newComment, token) {
	return fetchPost(newComment, token)
		.then(responseData => {
			const listComments = document.querySelector('.comments');
			fetchCommentsAndRenderAuthoriz(listComments);
		})
		.catch(error => {
			removerLoading();
			// inputComment.value = inputCommentValue;
			if (error.message === 'Плохой запрос') {
				alert('Имя и комментарий должны быть не менее 3х символов');
				return;
			}
			if (error.message === 'Сервер сломался') {
				fetchPostandRender(newComment, token);
			} else {
				alert(error.message)
			}
		});
}

function renderApp() {
	const listComments = document.querySelector('.comments');
	const formBlock = document.querySelector('.form');
	listComments.textContent = 'Подождите, пожалуйста, комментарии загружаются...';
	if (!token) {


		renderLoginComponent({
			listComments,
			formBlock,
			setToken: (newToken) => {
				token = newToken;
			},
			fetchCommentsAndRenderAuthoriz
		})
	} else {
		fetchCommentsAndRenderAuthoriz(listComments,formBlock);
	}
}

renderApp();

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
