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
// submitButtonDOM.addEventListener('click', (event) => {
    // kai ant to ivykio objekto issikvieciame si metoda, sustabdo default veikima. internete trumpniai randami event - e arba ev
//     event.preventDefault();
//    console.log('AAAAnd - action');
// });

// value - konkretaus inputo turima reiksme.
submitButtonDOM.addEventListener('click', e => {
    e.preventDefault();
    console.log(textInputDOM.value);

    const HTML = `<article class="item">
    <div class="text">${textInputDOM.value}</div>
    <div class="actions">
        <button>Done</button>
        <div class="divider"></div>
        <button>Edit</button>
        <button>Delete</button>
    </div>
</article>`;

if (listDOM.classList.contains('empty')) {
    (listDOM.classList.remove('empty'))
    listDOM.innerHTML += '';
}
listDOM.innerHTML += HTML;
});