import { registerUser } from "./api.js";
import {renderLoginComponent, renderEnterForm} from './login-component.js';
import { fetchCommentsAndRenderAuthoriz } from "./script.js";
import { renderAddForm } from "./handlerComments.js";


//Рендер формы регистрации
export function renderRegisterComponent(formBlock, listComments, setToken) {

	const registerFormHtml = `
		<div class="enter-form">
			<h2 class="enter-title">Форма регистрации</h2>
			<input type="text" class="enter-form-name" placeholder="Введите ваше имя" />
			<input type="text" class="enter-form-login" placeholder="Введите ваш логин" />
			<input type="password" class="enter-form-password" placeholder="Введите ваш пароль" />
			<div class="enter-form-row">
				<button class="register-form-button">Зарегистрироваться</button>
			</div>
			<div class="enter-form-row">
			<p class="reg-button-auth">Войти как авторизованный пользователь</p>
			<p class="cancel-button">Вернуться к просмотру комментариев</p>
			</div>
		</div>
	`

	formBlock.innerHTML = registerFormHtml;

	const regButtonAuth = document.querySelector('.reg-button-auth');
	const registerButton = document.querySelector('.register-form-button');
	const cancelButton = document.querySelector('.cancel-button');

	cancelButton.addEventListener('click', () => {
		listComments.classList.remove('hidden');
		renderLoginComponent({listComments,formBlock,setToken,fetchCommentsAndRenderAuthoriz})
	})

	regButtonAuth.addEventListener('click', () => {		
		renderEnterForm({listComments,formBlock,setToken,fetchCommentsAndRenderAuthoriz})
	})

	registerButton.addEventListener('click', () => {
		const name = formBlock.querySelector('.enter-form-name').value;
		const login = formBlock.querySelector('.enter-form-login').value;
		const password = formBlock.querySelector('.enter-form-password').value;

		registerUser({
			login: login,
			password: password,
			name: name,
		})
		.then((user) => {
			listComments.classList.remove('hidden');
			setToken(`Bearer ${user.user.token}`);
			fetchCommentsAndRenderAuthoriz(listComments);
			renderAddForm(formBlock, `Bearer ${user.user.token}`);
			const inputName = document.querySelector('.add-form-name');
			inputName.value = user.user.name
			inputName.disabled = true;
		})
		.catch((error) => {
			alert(error.message);
		})
	})
}
