(() => {

const querySelect = liwra.querySelect

// Arbitrary property access example
const lazyElems = querySelect('[data-lazy-content]')

const handleInitLazy = () => {
    const data = lazyElems.dataset.lazyContent;
    alert("content:\n" + JSON.stringify(data.unwrap(), null, 4));
    lazyElems.forEach((e, i) => e.innerText = data[i]);
}

const handleToggleBg = () => {
    const hasBg = lazyElems.classList.contains('backgrounded').every(b => b);

    // sane way to do it
    //lazyElems.classList.toggle('backgrounded', !hasBg);

    // gotta flex
    if (hasBg) {
        lazyElems.className = "";
    } else {
        lazyElems.className = "backgrounded";
    }
}

querySelect('[data-init-lazy]').addEventListener('click', handleInitLazy);

querySelect('[data-toggle-bg]').addEventListener('click', handleToggleBg);

})();