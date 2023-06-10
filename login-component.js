import { loginUser } from "./api.js";
import { fetchCommentsAndRender } from "./script.js";
import { renderAddForm } from "./handlerComments.js";
import { renderRegisterComponent } from "./register-component.js";

export const renderLoginComponent = ({ listComments, formBlock, setToken, fetchCommentsAndRenderAuthoriz }) => {
	fetchCommentsAndRender(listComments);

	const initialHtml = `
	Чтобы добавить комментарий <span class="autorization-button">авторизуйтесь</span>
	`;

	formBlock.innerHTML = initialHtml;

	const autorizationButton = document.querySelector('.autorization-button');

	autorizationButton.addEventListener('click', () => {
		listComments.classList.add('hidden');
		renderEnterForm({listComments,formBlock,setToken,fetchCommentsAndRenderAuthoriz})
	})
}

//Рендер формы входа
export const renderEnterForm = ({ listComments, formBlock, setToken, fetchCommentsAndRenderAuthoriz }) => {
	

		const enterFormHtml = `
		<div class="enter-form">
			<h2 class="enter-title">Форма входа</h2>
			<input type="text" class="enter-form-login" placeholder="Введите ваш логин" />
			<input type="password" class="enter-form-password" placeholder="Введите ваш пароль" />
			<div class="enter-form-row">
				<button class="enter-form-button">Войти</button>
			</div>
			<div class="enter-form-row">
				<p class="reg-button">Зарегистрироваться</p>
				<p class="cancel-button">Вернуться к просмотру комментариев</p>
			</div
		</div>
	`

		formBlock.innerHTML = enterFormHtml;

		const regButton = document.querySelector('.reg-button');
		const cancelButton = document.querySelector('.cancel-button');
		const enterButton = document.querySelector('.enter-form-button');

		regButton.addEventListener('click', () => {
			renderRegisterComponent(formBlock, listComments, setToken);
		})

		cancelButton.addEventListener('click', () => {
			listComments.classList.remove('hidden');
			renderLoginComponent({ listComments, formBlock, setToken, fetchCommentsAndRenderAuthoriz })
		})

		enterButton.addEventListener('click', () => {
			const login = document.querySelector('.enter-form-login').value;
			const password = document.querySelector('.enter-form-password').value;

			if (!login) {
				alert('Введите логин');
				return;
			}

			if (!password) {
				alert('Введите пароль');
				return;
			}

			loginUser({
				login: login,
				password: password
			})
				.then(user => {
					listComments.classList.remove('hidden');
					setToken(`Bearer ${user.user.token}`);
					fetchCommentsAndRenderAuthoriz(listComments);
					renderAddForm(formBlock, `Bearer ${user.user.token}`);
					setLocalStorage (login,password,`Bearer ${user.user.token}`,user.user.name);
					const inputName = document.querySelector('.add-form-name');
					inputName.value = user.user.name
					inputName.disabled = true;
				})
				.catch((error) => {
					alert(error.message);
				})
		})	
}

export const setLocalStorage = (login,password,token,userName) => {
	localStorage.setItem('login', login);
	localStorage.setItem('password', password);
	localStorage.setItem('token',token);
	localStorage.setItem('userName',userName);

}

export const getLocalStorage = () => {
	const authoriz = {};
	const login = localStorage.getItem('login');
	const password = localStorage.getItem('password');
	const token = localStorage.getItem('token');
	const userName = localStorage.getItem('userName');
	authoriz.login = login;
	authoriz.password = password;
	authoriz.token = token;
	authoriz.userName = userName;
	return authoriz;
}