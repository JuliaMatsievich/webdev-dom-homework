import { listComments, inputComment } from "./variables.js";
import { renderEditComment, renderComments } from "./render.js";
import { comments } from "./api.js";

// Функция для имитации запросов в API
function delay(interval = 300) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, interval);
	});
}

// Подписка на события кнопки Редактировать
export function initEditButtonEventListeners() {
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
export function initLikeButtonEventListeners() {

	const likeButtons = listComments.querySelectorAll('.like-button');

	for (const likeButton of likeButtons) {
		likeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			const target = event.target;
			const commentParrent = target.closest('.comment');
			const commentId = commentParrent.dataset.comment;
			likeButton.classList.add('-loading-like');

			delay(2000).then(() => {
				comments[commentId].likes = comments[commentId].isLiked ? comments[commentId].likes -= 1 : comments[commentId].likes += 1;
				comments[commentId].isLiked = !comments[commentId].isLiked;
				renderComments()
			});
		})
	}
}


//Подписка на кнопку Удалить комменатрий
export function initDeleteButtonEventListeners() {

	const deleteButtons = document.querySelectorAll('.delete-button');

	for (const deleteButton of deleteButtons) {
		deleteButton.addEventListener('click', (event) => {
			event.stopPropagation();
			const index = deleteButton.dataset.index;
			comments.splice(index, 1);
			renderComments();
		})
	}
}

//Подписка на событие ответить на комментарий
export function initAnswerCommentEventListener() {
	const commentElements = document.querySelectorAll('.comment');

	for (const commentElement of commentElements) {
		commentElement.addEventListener('click', (event) => {
			const index = commentElement.dataset.comment;

			let quoteBlock = `/** ${comments[index].name}:\n${comments[index].text} **/`;

			inputComment.value = `${quoteBlock}\n\n`;

			inputComment.focus();
		})
	}
}
