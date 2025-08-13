let fromCountry = document.getElementById('fromCountry');
let toCountry = document.getElementById('toCountry');
let fromImg = document.getElementById('fromCountryImage');
let toImg = document.getElementById('toCountryImage');
let amountInput = document.getElementById('amount');
let resultDiv = document.getElementById('userAPI');
let convertBtn = document.getElementById('convert');
let symbolSpan = document.getElementById('selectedSymbol');



// 2. Load ALL countries
async function loadCountries() {
  try {
    let res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,currencies');
    let countries = await res.json();

    
    countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    countries.forEach(country => {

      let currencyCode = country.currencies ? Object.keys(country.currencies)[0] : 'N/A';
      let currencySymbol = country.currencies && country.currencies[currencyCode]?.symbol ? country.currencies[currencyCode].symbol : '';

      
      let option1 = document.createElement('option');
      option1.value = currencyCode;
      option1.textContent = `  ${currencyCode} — ${country.name.common}`;
      option1.dataset.flag = country.flags.png;
      option1.dataset.symbol = currencySymbol;

      
      let option2 = option1.cloneNode(true);

      fromCountry.appendChild(option1);
      toCountry.appendChild(option2);
    });

    updateFromFlag();
    updateToFlag();
  } catch (error) {
    console.error('Error loading countries:', error);
  }
}

function updateFromFlag() {
  let selectedOption = fromCountry.options[fromCountry.selectedIndex];
  fromImg.src = selectedOption.dataset.flag;
  symbolSpan.textContent = selectedOption.dataset.symbol ? `(${selectedOption.dataset.symbol})` : '';
}


function updateToFlag() {
  let selectedOption = toCountry.options[toCountry.selectedIndex];
  toImg.src = selectedOption.dataset.flag;
}

//=============convertion================//
async function convertCurrency() {
  let fromCode = fromCountry.value;
  let toCode = toCountry.value;
  let amount = parseFloat(amountInput.value);

  if (!amount || isNaN(amount)) {
    resultDiv.textContent = 'You be Fool You no go enter valid amount.';
    return;
  }



  try {
    let res = await fetch(`https://v6.exchangerate-api.com/v6/6bbac20b0328fbf67e060781/latest/${fromCode}`);
    let data = await res.json();

   

    let rate = data.conversion_rates[toCode];
    let converted = (amount * rate).toFixed(2);

    resultDiv.textContent = `${amount} ${fromCode} = ${converted} ${toCode}`;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    resultDiv.textContent = 'Error fetching exchange rate.';
  }
}


fromCountry.addEventListener('change', updateFromFlag);
toCountry.addEventListener('change', updateToFlag);
convertBtn.addEventListener('click', convertCurrency);


loadCountries();



