// rikiavimas?.. 😏
// localStorage

const h1DOM = document.querySelector('h1');
const formDOM = document.forms[0];
const textInputDOM = formDOM.querySelector('input');
const submitButtonDOM = formDOM.querySelector('button');
const listDOM = document.querySelector('.list');

// susirandame toast ir jame ieskome likusiu elementu. Atkreipti demesi, kad ne document rasome.
const toastDOM = document.querySelector('.toast');
const toastTitleDOM = toastDOM.querySelector('.title');
const toastMessageDOM = toastDOM.querySelector('.message');
const toastCloseDOM = toastDOM.querySelector('.close');
// cia paspaudus x, pranesimas dingsta
toastCloseDOM.addEventListener('click', () => {
    toastDOM.classList.remove('active');
})

const localData = localStorage.getItem('tasks');
let todoData = [];

if (localData !== null) {
    const localDataArray = JSON.parse(localData);
    todoData = localDataArray;
    renderList();
}

submitButtonDOM.addEventListener('click', e => {
    e.preventDefault();

    const validationMsg = isValidText(textInputDOM.value);
    if (validationMsg !== true) {
        showToastError(validationMsg);
        return;
    }

    todoData.push({
        state: 'todo',
        text: textInputDOM.value.trim(),
        createdAt: Date.now(),
    });
    // isirasome i atminti
    localStorage.setItem('tasks', JSON.stringify(todoData));
    renderList();
    // jos funkcija yra aprasyta apacioje, mes optimizavome koda.
    showToastSuccess('Įrašas sėkmingai sukurtas.');
});

function renderList() {
    if (todoData.length === 0) {
        renderEmptyList();
    } else {
        renderTaskList();
    }
}

function renderEmptyList() {
    listDOM.classList.add('empty');
    listDOM.textContent = 'Empty';
}

function renderTaskList() {
    let HTML = '';

    for (const todo of todoData) {
        const completed = todo.state === 'done' ? 'completed' : '';
        HTML += `
            <article class="item ${completed}">
                <div class="date">${formatTime(todo.createdAt)}</div>
                <div class='state'>Atlikta</div>
                <div class="text">${todo.text}</div>
                <form class="hidden">
                    <input type="text" value='${todo.text}'>
                    <button type="submit">Update</button>
                    <button type="button">Cancel</button>
                </form>
                <div class="actions">
                    <button>Done</button>
                    <div class="divider"></div>
                    ${todo.state === 'done' ? '' : '<button>Edit</button>'}
                    // <button>Edit</button>
                    <button>Delete</button>
                </div>
            </article>`;
    }

    listDOM.innerHTML = HTML;
    listDOM.classList.remove('empty');

    const articlesDOM = listDOM.querySelectorAll('article');

    for (let i = 0; i < articlesDOM.length; i++) {
        const articleDOM = articlesDOM[i];
        const articleEditFormDOM = articleDOM.querySelector('form');
        const updateInputDOM = articleEditFormDOM.querySelector('input');
        const buttonsDOM = articleDOM.querySelectorAll('button');

        const updateDOM = buttonsDOM[0];
        updateDOM.addEventListener('click', event => {
            event.preventDefault();

            const validationMsg = isValidText(updateInputDOM.value);
            if (validationMsg !== true) {
                showToastError(validationMsg);
                return;
            }

            // trim() naudojome daznai formose, jis siuo atveju atims tarpus.
            // if (!isValidText(updateInputDOM.value)) {
            //     return;
            // }
            todoData[i].text = updateInputDOM.value.trim();
            renderTaskList();
            showToastSuccess('Įrašo informacija sėkmingai atnaujinta.');
        });
    
        const cancelDOM = buttonsDOM[1];
        cancelDOM.addEventListener('click', () => {
            articleDOM.classList.add('completed');
            showToastInfo('Įrašo informacijos redagavimas baigtas be jokių pakeitimų');
        });

        const doneDOM = buttonsDOM[2];
        doneDOM.addEventListener('click', () => {
            todoData[i].state = 'done'
            articleEditFormDOM.classList.add('hidden');
            localStorage.setItem('tasks', JSON.stringify(todoData));
        });

        const editDOM = buttonsDOM[3];
        editDOM.addEventListener('click', () => {
            articleEditFormDOM.classList.remove('hidden');
        });

        const deleteDOM = buttonsDOM[4];
        deleteDOM.addEventListener('click', () => {
            todoData.splice(i, 1);
            renderList();
            showToastSuccess('Įrašas sėkmingai ištrintas.');
        });
    }
}

// ar ivesta reiksme yra tinkama, ar irasytas tekstas, ar nera tarpu ir ar pirmosios raides didziosios.
// a -> false
// A -> true
// ? -> true
// 9 -> true
function isValidText(text) {
    if (typeof text !== 'string') {
        return 'Informacija turi būti tekstinė';
    }
    if (text === '') {
        return 'Parašytas tekstas negali būti tuščias.';
    }
    if (text.trim() === '') {
        return 'Parašytas tekstas negali būti vien iš tarpų';
    }
    if (text[0].toUpperCase() !== text[0]) {
        return 'Teksto pirmosios raidės turi būti didžiosios';
    }
    return true;
};

// function showToastSuccess (msg) {
//     toastDOM.classList.add('active');
//     toastDOM.dataset.state = 'success';
//     toastTitleDOM.textContent ='Pavyko';
//     toastMessageDOM.textContent = msg;
// }
// function showToastInfo (msg) {
//     toastDOM.classList.add('active');
//     toastDOM.dataset.state = 'info'
//     toastTitleDOM.textContent ='Informacija';
//     toastMessageDOM.textContent = msg;
// }
// function showToastWarning (msg) {
//     toastDOM.classList.add('active');
//     toastDOM.dataset.state = 'warning'
//     toastTitleDOM.textContent ='Įspėjimas';
//     toastMessageDOM.textContent = msg;
// }
// function showToastError (msg) {
//     toastDOM.classList.add('active');
//     dataset.state - data- kazkas, tas dataset ir atitinka
//     toastDOM.dataset.state = 'error'
//     toastTitleDOM.textContent ='Klaida';
//     toastMessageDOM.textContent = msg;
// }

// sutrumpinimas
function showToast(state, title, msg) {
    toastDOM.classList.add('active');
    toastDOM.dataset.state = state;
    toastTitleDOM.textContent = title;
    toastMessageDOM.textContent = msg;
}
function showToastSuccess(msg) {
    showToast('success', 'Pavyko', msg);
}
function showToastInfo(msg) {
    showToast('info', 'Informacija', msg);
}
function showToastWarning(msg) {
    showToast('warning', 'Klaida', msg);
}
function showToastError(msg) {
    showToast('error', 'Klaida', msg);
}

// cia mano sprendimas
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
function formatTime(timeInMs) {
    const d = new Date(timeInMs);
    const year = d.getFullYear();
    // grazina indeksa, menesis per viena skiriasi, jei rasai 07, tai isspausdina 6.
    const month = (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1);
    // gali buti ir day, bet isspausdins savites diena.
    // prisiraseme ternary, kad jei bus iki 10 atsirastu 0.
    const day = (d.getDate() < 10 ? '0' : '') + d.getDate();
    const hours = d.getHours();
    const minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    const seconds = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; 
}

// // destytojo sprendimas, bet sake tik pasizaidimas:
// function formatTime(timeInMs) {
//     const d = ('' + new Date()).split(' ');
//     return `${d[3]}-MM-${d[2]} ${d[4]}`;
//     2 apacioje padeda nustatyti tai stringas ar objektas
//     console.log(typeof d); nusistatome tipa
//     console.log(d.toString()); metodas toString
// }

// CRUD operations:
// -----------------------------------
// create   array.push({initial data})
// read     array.map()
// update   array[i] = {updated data}
// delete   array.splice(i, 1)


//Rikiavimas:
const sortingListDOM = document.querySelector('.list-actions');
const sortingButtonsDOM = sortingListDOM.querySelectorAll('button');

//Sorting: Laikas 0-9
const btnTime09DOM = sortingButtonsDOM[0];
btnTime09DOM.addEventListener('click', () => {
    const activeBtn = sortingListDOM.querySelector('.active');
    activeBtn.classList.remove('.active');
    todoData.sort(a, b => a.createdAt - b.createdAt);
    renderTaskList();
})
// Laikas 9-0
const btnTime90DOM = sortingButtonsDOM[1];

// Spalva A-Z
const btnColorAZDOM = sortingButtonsDOM[2];

// Spalva Z-A
const btnColorZADOM = sortingButtonsDOM[3];

// Pavadinimas A-Z
const btnTitleAZDOM = sortingButtonsDOM[4];

// Pavadinimas Z-A
const btnTitleZADOM = sortingButtonsDOM[5];