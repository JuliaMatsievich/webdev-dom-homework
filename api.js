// Функция запроса GET

export function fetchGet() {
	return fetch('https://webdev-hw-api.vercel.app/api/v1/julia-matsievich/comments', {
		method: 'GET'
	})
		.then(response => {
			if (response.status === 500) {
				throw new Error('код 500');
			}
			return response.json()
		})
		.catch(error => {
			if (error.message === 'код 500') {
				fetchGet();
			}
			alert('Кажется, у вас сломался интернет, попробуйте позже')
		})
}


// Функция запроса POST
// export function fetchPost(newComment) {
// 	return 
// }
// const fetchPost = (newComment) => {
// 	fetch('https://webdev-hw-api.vercel.app/api/v1/julia-matsievich/comments', {
// 		method: 'POST',
// 		body: JSON.stringify(newComment)
// 	})
// 		.then(response => {
// 			if(response.status === 400) {
// 				throw new Error('код 400');
// 			}
// 			if(response.status === 500) {
// 				throw new Error('код 500');
// 			}
// 			return response.json();
// 		})
// }

// export {fetchGet}
