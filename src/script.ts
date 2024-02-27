class Country {
    name: string;
    population: number;
    region: string;
    currencies: Currency;

    constructor(name: string, population: number, region: string, currencies: Currency) {
        this.name = name;
        this.population = population;
        this.region = region;
        this.currencies = currencies;
    }
}

class Currency {
    name: string;
    symbol: string;

    constructor(name: string, symbol: string) {
        this.name = name;
        this.symbol = symbol;
    }
}

async function getCountryFromApi(): Promise<Country[]> {
    try {
        const response = await $.ajax({
            url: "https://restcountries.com/v3.1/all",
            method: "GET",
            dataType: "json"
        });
        return response.map((country: any) => new Country(country.name.common, country.population, country.region, country.currencies));
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function updateCountryTable(countries: Country[]): Promise<Country[]>{
    const search = $('input[type="text"]').val()?.toString().toLowerCase() || '';

    if (search === '') {
        const tbody = $('#table tbody');
        tbody.empty();
        totalOfCurrencies([]);
        return [];
    }

    const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(search));
    
    const tbody = $('#table tbody');
    tbody.empty();

    filteredCountries.forEach(country => {
        const tr = $('<tr></tr>');
        const nameCell = $('<td></td>').text(country.name);
        const populationCell = $('<td></td>').text(country.population);
        tr.append(nameCell, populationCell);
        tbody.append(tr);
    });

    totalOfCurrencies(filteredCountries);

    return filteredCountries;
}


async function updateRegionTable(countries: Country[]): Promise<void> {
    const search = $('input[type="text"]').val()?.toString().toLowerCase() || '';
    const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(search));
    
    const regionCounts: { [key: string]: number } = {};
    filteredCountries.forEach(country => {
        regionCounts[country.region] = (regionCounts[country.region] || 0) + 1;
    });

    const tbody = $('#regionTable tbody');
    tbody.empty();

    Object.keys(regionCounts).forEach(region => {
        const tr = $('<tr></tr>');  
        const regionCell = $('<td></td>').text(region);
        const countCell = $('<td></td>').text(regionCounts[region]);
        tr.append(regionCell, countCell);
        tbody.append(tr);
    });
}

async function calculatePopulationStats(countries: Country[]): Promise<{ totalPopulation: number, averagePopulation: number }> {
    if (countries.length === 0) {
        return { totalPopulation: 0, averagePopulation: 0 };
    }

    const totalPopulation = countries.reduce((container, country) => container + country.population, 0);
    const averagePopulation = Math.floor(totalPopulation / countries.length);

    return { totalPopulation, averagePopulation };
}

async function totalNumberOfCountrys(countries: Country[]): Promise<number> {
    return countries.length;
}

function totalOfCurrencies(countries: Country[]): void {
    const currenciesCount: { [key: string]: number } = {};

    countries.forEach(country => {
        if (!country.currencies) {
            currenciesCount[`No currencies found for ${country.name}`] = (currenciesCount[`No currencies found for ${country.name}`] || 0);
            return;
        }

        const keys = Object.keys(country.currencies);
        keys.forEach(key => {
            currenciesCount[key] = (currenciesCount[key] || 0) + 1;
        })
    })

    const tbody = $('#currencieTable tbody');
    tbody.empty();

    Object.keys(currenciesCount).forEach(currency => {
        const tr = $('<tr></tr>');
        const currencyCell = $('<td></td>').text(currency);
        const currencyCountCell = $('<td></td>').text(currenciesCount[currency]);

        tr.append(currencyCell, currencyCountCell);
        tbody.append(tr);
    })
}

(async function (): Promise<void> {
    const countries = await getCountryFromApi();

    $('#displayAllButton').on('click', async () => {
        const filteredCountries = await updateCountryTable(countries);
        await updateRegionTable(filteredCountries);

        const { totalPopulation, averagePopulation } = await calculatePopulationStats(filteredCountries);
        const totalCountryCount = await totalNumberOfCountrys(filteredCountries);

        $('#totalPopulation').text(`Total Population: ` + totalPopulation);
        $('#averagePopulation').text(`Average Population: ` + averagePopulation);
        $('#totalOfCountries').text(`Total Countries: ` + totalCountryCount);
    });

    $('input[type="text"]').on('keyup', async () => {
        const filteredCountries = await updateCountryTable(countries);
        await updateRegionTable(filteredCountries);

        const { totalPopulation, averagePopulation } = await calculatePopulationStats(filteredCountries);
        const totalCountryCount = await totalNumberOfCountrys(filteredCountries);

        $('#totalPopulation').text(`Total Population: ` + totalPopulation);
        $('#averagePopulation').text(`Average Population: ` + averagePopulation);
        $('#totalOfCountries').text(`Total Countries: ` + totalCountryCount);
    });

})();