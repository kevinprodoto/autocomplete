const search = document.querySelector('.autocomplete__sector');
const searchItems = search.querySelectorAll('.autocomplete__sector-item');
const searchData = [];
const results = document.querySelector('.autocomplete__results');
const input = document.querySelector('.autocomplete__input');
async function getRepoData(entry) {
  const url = 'https://api.github.com/search/repositories?q=';
  const data = await (await (await fetch(`${url}${entry}`)).json()).items.slice(0,5);
  search.style.display = 'block';
  return data;
}
const debounce = (fn, delay) => {
  let isCalled = false;
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
      isCalled = false;
    }
    if (!isCalled) {
      isCalled = true;
      timeout = setTimeout(async () => {
        await fn.apply(context, args);
        isCalled = false;
      }, delay);
    }
  };
};
async function setRepoData(entry) {
  const dataReady = await getRepoData(entry);
  dataReady.forEach((item, i) => {
    searchData[i] = item;
    const name = searchItems[i].querySelector('.autocomplete__name-owner');
    const stars = searchItems[i].querySelector('.autocomplete__stars');
    name.textContent = `${item.full_name} by ${item.owner.login}`;
    stars.textContent = `${item.stargazers_count} ★`;
  });
}
const debSet = debounce(setRepoData, 500);
input.oninput = async (e) => {
  if (e.target.value === '') search.style.display = 'none';
  await debSet(e.target.value);
};
searchItems.forEach((item) => {
  item.onclick = () => {
    input.value = '';
    search.style.display = 'none';
    const entry = document.createElement('article');
    entry.className = 'autocomplete__results-item';
    entry.innerHTML = `${item.innerHTML}<div class="autocomplete__remove"><span>❌</span</div>`;
    results.firstElementChild.style.display = 'block';
    results.appendChild(entry);
    entry.lastElementChild.onclick = (e) => {
      if (results.children.length === 2) {
        results.firstElementChild.style.display = '';
      }
      e.target.parentNode.parentNode.remove();
    };
  };
});
