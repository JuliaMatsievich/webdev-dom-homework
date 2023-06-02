import { form, loading} from "./variables.js";

//Рендер загрузки
export function renderLoading() {
	form.classList.add('hidden');
	loading.classList.remove('hidden');
}

//Убрать загрузку
export function removerLoading() {
	form.classList.remove('hidden');
	loading.classList.add('hidden');
}
