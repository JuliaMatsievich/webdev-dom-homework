import { listComments, autorizationButton, formBlock} from "./variables.js";
import { renderEditComment, renderComments, renderCommentsAuthoriz } from "./handlerComments.js";
import { comments, fetchCommentsAndRenderAuthoriz } from "./script.js";
import { deleteComments } from "./api.js";

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
export function initLikeButtonEventListeners(listComments) {

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
				renderCommentsAuthoriz(listComments,token)
			});
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
			// comments.splice(index, 1);
			// renderComments(listComments);
			deleteComments({ token,id })
			.then((responsData) => {
				console.log(responsData);
			})
			.catch(error => {
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

