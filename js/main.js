// rikiavimas?.. 😏
// localStorage

const h1DOM = document.querySelector('h1');
const formDOM = document.forms[0];
const textInputDOM = formDOM.querySelector('input');
const colorInputDOM = formDOM.querySelector('input[type="color"]');
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
    todoData = JSON.parse(localData);
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
        color: colorInputDOM.value,
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
        HTML += `
            <article class="item" data-state="${todo.state}" style="border-left-color:${todo.color};">
                <div class="date">${formatTime(todo.createdAt)}</div>
                <div class="state">Atlikta</div>
                <div class="text">${todo.text}</div>
                <form class="hidden">
                    <input type="text" value="${todo.text}">
                    <button class="update" type="submit">Update</button>
                    <button class="cancel" type="button">Cancel</button>
                </form>
                <div class="actions">
                    <button class="done">Done</button>
                    <div class="divider"></div>
                    ${todo.state === 'done' ? '' : '<button class="edit">Edit</button>'}
                    <button class="delete">Delete</button>
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
        // const buttonsDOM = articleDOM.querySelectorAll('button');

        const updateDOM = articleDOM.querySelector('button.update');
        if (updateDOM !== null) {
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
            localStorage.setItem('tasks', JSON.stringify(todoData));
           });
        }
        const cancelDOM = articleDOM.querySelector('button.cancel');
        if (cancelDOM !== null) {
            cancelDOM.addEventListener('click', () => {
               articleDOM.classList.add('completed');
               showToastInfo('Įrašo informacijos redagavimas baigtas be jokių pakeitimų');
           });
        }

        const doneDOM = articleDOM.querySelector('button.done');
        if (doneDOM !== null) {
         doneDOM.addEventListener('click', () => {
            todoData[i].state = 'done';
            articleDOM.dataset.state = 'done';
            localStorage.setItem('tasks', JSON.stringify(todoData));
            renderList();
        });   
        }
        // const editDOM = buttonsDOM[3];
        const editDOM = articleDOM.querySelector('button.edit');
        if (editDOM !== null) {
            editDOM.addEventListener('click', () => {
            articleEditFormDOM.classList.remove('hidden'); 
            localStorage.setItem('tasks', JSON.stringify(todoData));
        });
        }
        
        const deleteDOM = articleDOM.querySelector('button.delete');
        if (deleteDOM !== null) {
          deleteDOM.addEventListener('click', () => {
            todoData.splice(i, 1);
            renderList();
            showToastSuccess('Įrašas sėkmingai ištrintas.');   
        });  
        }
        
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

// ##############################################################################################
//Rikiavimas:
const sortingListDOM = document.querySelector('.list-actions');
const sortingButtonsDOM = sortingListDOM.querySelectorAll('button');

// Sorting: Laikas 0-9
const btnTime09DOM = sortingButtonsDOM[0];
btnTime09DOM.addEventListener('click', () => {
    // susirandame mygtuka active
    sortingListDOM.querySelector('.active').classList.remove('active');
    btnTime09DOM.classList.add('active');
    // kad butu surikiuota pagal data.
    todoData.sort((a, b) => a.createdAt - b.createdAt);
    renderTaskList();
});

// Sorting: Laikas 9-0
const btnTime90DOM = sortingButtonsDOM[1];
btnTime90DOM.addEventListener('click', () => {
    // sutrumpintas variantas. Susiranda kuris is tu visu button yra aktyvus, nuimu nuo jo ta klase.
    sortingListDOM.querySelector('.active').classList.remove('active');
    // bent ant to konkretaus mygtuko uzdedu klase, jis siuo metu yra aktyvus.
    btnTime90DOM.classList.add('active');
    todoData.sort((a, b) => b.createdAt - a.createdAt);
    renderTaskList();
});

// Sorting: Spalva A-Z
const btnColorAZDOM = sortingButtonsDOM[2];
btnColorAZDOM.addEventListener('click', () => {
    sortingListDOM.querySelector('.active').classList.remove('active');
    btnColorAZDOM.classList.add('active');
    todoData.sort((a, b) => (a.color < b.color) ? -1 : (a.color === b.color) ? 0 : 1);
    renderTaskList();
});

// Sorting: Spalva Z-A
const btnColorZADOM = sortingButtonsDOM[3];
btnColorZADOM.addEventListener('click', () => {
    sortingListDOM.querySelector('.active').classList.remove('active');
    btnColorZADOM.classList.add('active');
    todoData.sort((a, b) => (b.color < a.color) ? -1 : (a.color === b.color) ? 0 : 1);
    renderTaskList();
});

// Sorting: Pavadinimas A-Z
const btnTitleAZDOM = sortingButtonsDOM[4];
btnTitleAZDOM.addEventListener('click', () => {
    sortingListDOM.querySelector('.active').classList.remove('active');
    btnTitleAZDOM.classList.add('active');
    todoData.sort((a, b) => (a.text < b.text) ? -1 : (a.text === b.text) ? 0 : 1);
    renderTaskList();
});

// Sorting: Pavadinimas Z-A
const btnTitleZADOM = sortingButtonsDOM[5];
btnTitleZADOM.addEventListener('click', () => {
    sortingListDOM.querySelector('.active').classList.remove('active');
    btnTitleZADOM.classList.add('active');
    todoData.sort((a, b) => (b.text < a.text) ? -1 : (a.text === b.text) ? 0 : 1);
    renderTaskList();
});