import { fetchGet, fetchGetAuthoriz, fetchPost } from "./api.js";
import { renderDate, renderComments, renderCommentsAuthoriz, renderAddForm } from "./handlerComments.js";
import { renderLoading, removerLoading } from "./handlerLoading.js";
import { renderLoginComponent, getLocalStorage } from './login-component.js';
import { format } from "date-fns";

export let comments = [];

let token = null;

export const fetchCommentsAndRender = (listComments) => {
	return fetchGet()
		.then(responseData => {
			let appcomments = responseData.comments.map((comment) => {
				const createDate = format(new Date(comment.date), 'yyyy-MM-dd hh.mm.ss');
				return {
					id: comment.id,					
					name: comment.author.name,
					date: createDate,
					text: comment.text,
					likes: comment.likes,
					isLiked: comment.isLiked,
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
				const createDate = format(new Date(comment.date), 'yyyy-MM-dd hh.mm.ss');
				return {
					id: comment.id,
					name: comment.author.name,
					date: createDate,
					text: comment.text,
					likes: comment.likes,
					isLiked: comment.isLiked,
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

export const renderApp = () => {
	const listComments = document.querySelector('.comments');
	const formBlock = document.querySelector('.form');
	listComments.textContent = 'Подождите, пожалуйста, комментарии загружаются...';

	if (!getLocalStorage().token) {
		renderLoginComponent({
			listComments,
			formBlock,
			setToken: (newToken) => {
				token = newToken;
			},
			fetchCommentsAndRenderAuthoriz
		})
	} else {
		fetchCommentsAndRenderAuthoriz(listComments);
		token = getLocalStorage().token;
		renderAddForm(formBlock,token);
		const inputName = document.querySelector('.add-form-name');
		inputName.value = getLocalStorage().userName;
		inputName.disabled = true;
	}
}

renderApp();

//Подписка на создание комментария нажатием клавиши Enter
// form.addEventListener('keyup', (event) => {
// 	if (event.key === 'Enter') {
// 		handlerAddComment();
// 	}
// });


