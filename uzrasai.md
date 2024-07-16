// susirandame h1 taga, nes veliau tures atsirasti skaiciai,html yra uzkomentuota 
const h1DOM = document.querySelector('h1');

// visos formos radimas, cia yra trumpinys visu formu.
const formDOM = document.forms[0];

// formoje susirasti input. kad pasiimtume imputa  ir ji perskaitytume.
const textInputDOM = formDOM.querySelector('input');

//mygtukas
const submitButtonDOM = formDOM.querySelector('button');

const listDOM = document.querySelector('.list');

// kai yra paspaudziamas pagrintinis mygtukas (event), mums reikia pagauti ta event ir iskaityti kas parasyta tame input.
// ka addEventListener padaro su zemiau aprasyta funkcija? jis paduoda siai funkcijai PointerEvent tipo objekta. t.y. sitai funkcijai addEventListener metodas ja iskviesdamas, jis perduoda objekta,kuriame yra aprasytas ivykis, kuris aprasytas kaip 'click'.
    submitButtonDOM.addEventListener('click', (event) => {
    // kai ant to ivykio objekto issikvieciame si metoda, sustabdo default veikima. internete trumpniai randami event - e arba ev
    event.preventDefault();
    console.log('AAAAnd - action');
   });

// Value - konkretaus inpute irasyta reiksme.
submitButtonDOM.addEventListener('click', e => {
    e.preventDefault();
    console.log(textInputDOM.value);
});
    const HTML = `<article class="item">
    <div class="text">${textInputDOM.value}</div>
    <div class="actions">
        <button>Done</button>
        <div class="divider"></div>
        <button>Edit</button>
        <button>Delete</button>
    </div>
</article>`;

// cia nd, kad nerodytu empty 
if (listDOM.classList.contains('empty')) {
   (listDOM.classList.remove('empty'))
   listDOM.innerHTML += '';
};
listDOM.innerHTML += HTML;

const todoData = [];

// spaudinejant mygtuka siuo atveju visa informacija yra renkama i masyva
submitButtonDOM.addEventListener('click', e => {
    e.preventDefault();

    // pasidarome validacija
    if (textInputDOM.value.length === 0) {
        return;  
    }
    // i todo masyva ipushinsiu ivesties informacija, tai kas yra parasyta.
    // ribinis dalykas su 'textInputDOM.value', nes input yra tuscias
    todoData.push(textInputDOM.value);
    // norint matyti rezultata prirasyti funkcija
    renderList();
});

// sugeneruokime sarasa, kuris sugebes isspausdinti ir tuscia ir prirasytas korteles.
// funkcijos yra aprasytos apacioje. 
function renderList() {
    if (todoData.length === 0) {
        // empty
        renderEmptyList();
    } else {
        // eile korteliu
        renderTaskList();
    }   
}


function renderEmptyList() { 
    listDOM.classList.add('empty');
    listDOM.textContent = 'empty'; 
}

// generuoja korteles su parasytu tekstu, bet negalime korteliu istrinti, kad atsirastu 'empty' zodis 
function renderTaskList() {
    listDOM.classList.remove('empty');

    let HTML = '';

    for (const todo of todoData) {
        HTML += `
             <article class="item">
                <div class="text">${todo}</div>
                <form class="hidden">
                     <input type="text">
                     <button type="submit">Update</button>
                     <button type="button">Cancel</button>
                </form>
                <div class="actions">
                    <button>Done</button>
                    <div class="divider"></div>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            </article>`;
    }
    listDOM.innerHTML = HTML;

    // einame ieskoti articlu ir mygtuku. listDOM yra bendras tevas. 
    const articlesDOM = listDOM.querySelectorAll('article');
    // console.log(articlesDOM); ar pavyksta rasti ir ka pavyko. o rado visa article. 

    // norint surasti index, kuris yra reikalingas  todoData.splice(index, 1); vietoj arrow funkcijos, rasome savo iprasta. 
    for (let i = 0; i < articlesDOM.length; i++) {
        const articleDOM = articlesDOM[i];
        // for (const articleDOM of articlesDOM) {
        // su sita salyga yra randamas "done", tai pirmasis tenkinantis salyga, nes tai daro butent "querySelector". 
        // const deleteDOM = articleDOM.querySelector('button');

        // nurodome indeksa kurio mygtuko mums reikia
        const deleteDOM = articleDOM.querySelectorAll('button')[2];

        // tuomet ant to mygtuko registruoti addEventListener
        deleteDOM.addEventListener('click', () => {
            // console.log('DELETE...'); console isspausdina, zodi DELETE.

            // pasalinti tevini article elementa.
            articleDOM.remove();

            // reikia ir is atminties const todoData istrinti 3. cia pvz koks numeris. 
            // masyvo metodas, kuris padeda pasalinti norima irasa is jo. pirma indeksa ir tik 1.s
            // index, kad nustatytume kuri reikia istrinti.
            todoData.splice(index, 1);
        });
    }
}

// DOM [1, 2, 3] - is DOM pasaliname 4, 5.
// RAM [1, 4, 5] - is RAM tuo taru salinasi 2, 3.

// CRUD operations
// create  array.push({initial data})
// ready   array.map()
// update  array[i]=  {update date}
// delete  array.splice(i, 1)

const articlesDOM = listDOM.querySelectorAll('article');
// console.log(articlesDOM);

for (let i = 0; i < articlesDOM.length; i++) {
    const articleDOM = articlesDOM[i];
    const deleteDOM = articleDOM.querySelectorAll('button')[2];
        deleteDOM.addEventListener('click', () => {
        todoData.splice(i, 1);
        renderList();
    });
}

for (let i = 0; i < articlesDOM.length; i++) {
    
    const articleDOM = articlesDOM[i];
    // susirandame forma
    const articleEditFormDOM = articleDOM.querySelectorAll('form');
    // querySelectorAll gauna masyva
    const updateInputDOM = articleDOM.querySelector('input');
    // surandame visus mygtukus;
    const buttonsDOM = articleDOM.querySelectorAll('button')

    const editDom = buttonsDOM[3];
    editDom.addEventListener('clikc', () => {
    articleEditFormDOM.classList.remove('hidden');
});
const cancelDom = buttonsDOM[1];
    cancelDom.addEventListener('clikc', () => {
    articleEditFormDOM.classList.add('hidden');
});
const updateDom = buttonsDOM[0];
    updateDom.addEventListener('clikc', event => {
        event.preventDefault();
    todoData[i] = updateInputDOM.value;
    renderTaskList();
});
const deleteDOM = buttonsDOM[4];
deleteDOM.addEventListener('click', () => {
    todoData.splice(i, 1);
    renderList();
});
}


// ant elemento uzdeti eventListener galime tuomet, kad atsiranda musus lentele, o ji atsiranda tuomet po sios eilutes  listDOM.innerHTML = HTML. Po sios eilutes jau visi mygtukai egzistuoja.