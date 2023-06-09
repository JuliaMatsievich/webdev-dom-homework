import { listComments, autorizationButton, formBlock} from "./variables.js";
import { renderEditComment, renderComments, renderCommentsAuthoriz } from "./handlerComments.js";
import { comments, fetchCommentsAndRenderAuthoriz } from "./script.js";
import { deleteComments, toggleLike } from "./api.js";

// Функция для имитации запросов в API
function delay(interval = 300) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, interval);
	});
}

// Подписка на события кнопки Редактировать
export function initEditButtonEventListeners(listComments) {
	const EditButtons = listComments.querySelectorAll('.edit-button');

	for (const EditButton of EditButtons) {
		EditButton.addEventListener('click', (event) => {
			event.stopPropagation();
			const target = event.target;
			renderEditComment(target)
		})
	}
}

//Подписка на события клика по кнопке Лайк
export function initLikeButtonEventListeners(listComments,token) {

	const likeButtons = listComments.querySelectorAll('.like-button');

	for (const likeButton of likeButtons) {
		likeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			const target = event.target;
			const commentParrent = target.closest('.comment');
			const id = commentParrent.dataset.comment;
			const commentId = comments[id].id;
			likeButton.classList.add('-loading-like');
			toggleLike({token,id: commentId})
			.then(result => {
				comments[id].likes = result.result.likes;
				comments[id].isLiked = result.result.isLiked;
				renderCommentsAuthoriz(listComments,token);
			})
		})
	}
}


//Подписка на кнопку Удалить комменатрий
export function initDeleteButtonEventListeners(listComments,token) {

	const deleteButtons = document.querySelectorAll('.delete-button');

	for (const deleteButton of deleteButtons) {
		deleteButton.addEventListener('click', (event) => {
			event.stopPropagation();
			const id = deleteButton.dataset.index;
			const commentId = comments[id].id;
			deleteComments({ token,
				id: commentId})
			.then((comments) => {
				fetchCommentsAndRenderAuthoriz(listComments);
			})
			.catch(error => {
				if (error.message === 'Сервер сломался') {
					fetchCommentsAndRenderAuthoriz(listComments);
				}
				console.log(error.message);
			})
			renderCommentsAuthoriz(listComments,token)

		})
	}
}

//Подписка на событие ответить на комментарий
export function initAnswerCommentEventListener() {
	const commentElements = document.querySelectorAll('.comment');
	const inputComment = document.querySelector('.add-form-text')

	for (const commentElement of commentElements) {
		commentElement.addEventListener('click', (event) => {
			const index = commentElement.dataset.comment;

			let quoteBlock = `/** ${comments[index].name}:\n${comments[index].text} **/`;

			inputComment.value = `${quoteBlock}\n\n`;

			inputComment.focus();
		})
	}
}

