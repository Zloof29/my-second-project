"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Country {
    constructor(name, population, region, currencies) {
        this.name = name;
        this.population = population;
        this.region = region;
        this.currencies = currencies;
    }
}
class Currency {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
    }
}
function getCountryFromApi() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield $.ajax({
                url: "https://restcountries.com/v3.1/all",
                method: "GET",
                dataType: "json"
            });
            return response.map((country) => new Country(country.name.common, country.population, country.region, country.currencies));
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
function updateCountryTable(countries) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const search = ((_a = $('input[type="text"]').val()) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()) || '';
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
    });
}
function updateRegionTable(countries) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const search = ((_a = $('input[type="text"]').val()) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()) || '';
        const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(search));
        const regionCounts = {};
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
    });
}
function calculatePopulationStats(countries) {
    return __awaiter(this, void 0, void 0, function* () {
        if (countries.length === 0) {
            return { totalPopulation: 0, averagePopulation: 0 };
        }
        const totalPopulation = countries.reduce((container, country) => container + country.population, 0);
        const averagePopulation = Math.floor(totalPopulation / countries.length);
        return { totalPopulation, averagePopulation };
    });
}
function totalNumberOfCountrys(countries) {
    return __awaiter(this, void 0, void 0, function* () {
        return countries.length;
    });
}
function totalOfCurrencies(countries) {
    const currenciesCount = {};
    countries.forEach(country => {
        if (!country.currencies) {
            currenciesCount[`No currencies found for ${country.name}`] = (currenciesCount[`No currencies found for ${country.name}`] || 0);
            return;
        }
        const keys = Object.keys(country.currencies);
        keys.forEach(key => {
            currenciesCount[key] = (currenciesCount[key] || 0) + 1;
        });
    });
    const tbody = $('#currencieTable tbody');
    tbody.empty();
    Object.keys(currenciesCount).forEach(currency => {
        const tr = $('<tr></tr>');
        const currencyCell = $('<td></td>').text(currency);
        const currencyCountCell = $('<td></td>').text(currenciesCount[currency]);
        tr.append(currencyCell, currencyCountCell);
        tbody.append(tr);
    });
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const countries = yield getCountryFromApi();
        $('#displayAllButton').on('click', () => __awaiter(this, void 0, void 0, function* () {
            const filteredCountries = yield updateCountryTable(countries);
            yield updateRegionTable(filteredCountries);
            const { totalPopulation, averagePopulation } = yield calculatePopulationStats(filteredCountries);
            const totalCountryCount = yield totalNumberOfCountrys(filteredCountries);
            $('#totalPopulation').text(`Total Population: ` + totalPopulation);
            $('#averagePopulation').text(`Average Population: ` + averagePopulation);
            $('#totalOfCountries').text(`Total Countries: ` + totalCountryCount);
        }));
        $('input[type="text"]').on('keyup', () => __awaiter(this, void 0, void 0, function* () {
            const filteredCountries = yield updateCountryTable(countries);
            yield updateRegionTable(filteredCountries);
            const { totalPopulation, averagePopulation } = yield calculatePopulationStats(filteredCountries);
            const totalCountryCount = yield totalNumberOfCountrys(filteredCountries);
            $('#totalPopulation').text(`Total Population: ` + totalPopulation);
            $('#averagePopulation').text(`Average Population: ` + averagePopulation);
            $('#totalOfCountries').text(`Total Countries: ` + totalCountryCount);
        }));
    });
})();
