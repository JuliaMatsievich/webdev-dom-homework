import { initEditButtonEventListeners, initLikeButtonEventListeners, initDeleteButtonEventListeners, initAnswerCommentEventListener } from "./eventlisteners.js";
import { comments, fetchCommentsAndRender, fetchCommentsAndRenderAuthoriz } from "./script.js";
import { loginUser } from './api.js';
import { handlerAddComment } from "./handlerComments.js";


//Рендер формы регистрации
export function renderRegisterForm() {
	const registerFormHtml = `
		<div class="enter-form">
			<h2 class="enter-title">Форма регистрации</h2>
			<input type="text" class="enter-form-name" placeholder="Введите ваше имя" />
			<input type="text" class="enter-form-login" placeholder="Введите ваш логин" />
			<input type="text" class="enter-form-password" placeholder="Введите ваш пароль" />
			<div class="enter-form-row">
				<button class="enter-form-button button-disabled ">Зарегистрироваться</button>
			</div>
			<p class="reg-button-auth">Войти как авторизованный пользователь</p>
		</div>
	`

	formBlock.innerHTML = registerFormHtml;

	const regButtonAuth = document.querySelector('.reg-button-auth');

	regButtonAuth.addEventListener('click', () => {
		renderEnterForm()
	})
}
