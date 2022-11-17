import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const countryInputEl = document.querySelector('#search-box');
const countryListELClear = document.querySelector('.country-list');
const countryInfoElClear = document.querySelector('.country-info');

function clearInput() {
  countryListELClear.innerHTML = '';
  countryInfoElClear.innerHTML = '';
}

function onInputCountry(event) {
  event.preventDefault();
  clearInput();

  if (!event.target.value == '') {
    fetchCountries(event.target.value.trim())
      .then(resultInputCountries)
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }
}

function resultInputCountries(data) {
  clearInput();

  if (data.length >= 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (data.length === 1) {
    countryInfoElClear.innerHTML = markupForMainMessage(data[0]);
  } else if (data.length >= 2 && data.length < 10) {
    countryListELClear.innerHTML = data
      .map(country => markupForSmallMessage(country))
      .join('');
  }
}

function markupForMainMessage({ flags, name, capital, population, languages }) {
  return `
      <div class="countries__card">
            <img class="countries__flag" src="${flags.svg}" alt="${
    name.official
  } national flag" width="300" height="auto" />
          <h2 class="countries__title">${name.official}</h2>
        <p class="countries__capital"><span class="">Capital:</span> ${capital}</p>
        <p class="countries__population"><span class="">Population:</span> ${population}</p>
        <p class="countries__languages"><span class="">Languages:</span> ${Object.values(
          languages
        )}</p>
      </div>`;
}

function markupForSmallMessage({ flags, name }) {
  return `
    <h2 class="countries__title">${name.official} <img class="countries__flag" src="${flags.svg}" alt="${name.official} national flag" width="30" height="auto"/></h2>`;
}

countryInputEl.addEventListener(
  'input',
  debounce(onInputCountry, DEBOUNCE_DELAY)
);
