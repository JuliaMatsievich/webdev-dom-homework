import { loading,formBlock } from "./variables.js";

//Рендер загрузки
export function renderLoading() {
	formBlock.classList.add('hidden');
	loading.classList.remove('hidden');
}

//Убрать загрузку
export function removerLoading() {
	formBlock.classList.remove('hidden');
	loading.classList.add('hidden');
}
