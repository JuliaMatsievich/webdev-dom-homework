import { fetchGet } from "./api.js";
import { inputName, inputComment, listComments, formButton, form } from "./variables.js";
import { handlerAddComment } from "./handlerAddComments.js";

//Начальное состояние формы
export function initialState() {
	inputName.value = '';
	inputComment.value = '';
	formButton.disabled = true;
	formButton.classList.add('button-disabled');
}

listComments.textContent = 'Подождите, пожалуйста, комментарии загружаются...';
initialState();
fetchGet();

//Подписка на событие клика по кнопке "Написать"
formButton.addEventListener('click', handlerAddComment);

//Подписка на создание комментария нажатием клавиши Enter
form.addEventListener('keyup', (event) => {
	if (event.key === 'Enter') {
		handlerAddComment();
	}
});

//Подписка на активность/неактивность кнопки "Написать"
form.addEventListener('input', () => {
	if (inputName.value && inputComment.value) {
		formButton.disabled = false;
		formButton.classList.remove('button-disabled')
	} else {
		formButton.disabled = true;
		formButton.classList.add('button-disabled')
	}
})

