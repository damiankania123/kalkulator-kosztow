const fuelCostInPln = 7
const place = 'Rzeszow'
const rentalPriceInPln = 200 //bazowa cena wypozyczenia
const fuelConsumption = 6 // srednie spalanie na 100km
const millisecunds = 86400000
const year = new Date().getFullYear()
const vatValue = 1.23

const pricecategory = {
    basic: 1,
    standard: 1.3,
    medium: 1.6,
    premium: 2,
    default: 1
}

const cars = [{
    mark: 'Audi',
    model: 'S6',
    category: "medium",
    quantity: 3,
    id: 0
}, {
    mark: 'BWM',
    model: 'M3',
    category: "premium",
    quantity: 2,
    id: 1
}, {
    mark: 'ford',
    model: 'kuga',
    category: "basic",
    quantity: 4,
    id: 2
}, {
    mark: 'KIA',
    model: 'SPORTAGE',
    category: "standard",
    quantity: 5,
    id: 3
}];
cars.forEach(car => {
    document.querySelector('#carsList').innerHTML += `<option value="${car.id}">${car.mark} ${car.model}</option>`
});

const info = document.querySelector('#info')
const button = document.querySelector('#submit');

function getCarRentCost() {

    let price = rentalPriceInPln
    const dateRental = document.querySelector('#from').value
    const dateDelivery = document.querySelector('#to').value
    const rentalFrom = new Date(dateRental).getTime()
    const rentalTo = new Date(dateDelivery).getTime()
    const result = (rentalTo / millisecunds) - (rentalFrom / millisecunds)
    const yearOfReceiptOfDrivingLicense = document.querySelector('#drivingLicense').value
    const newyearOfReceiptOfDrivingLicense = year - yearOfReceiptOfDrivingLicense
    let carsList = document.querySelector('#carsList').value
    let categorySelected = cars[carsList].category
    let carsQuantity = cars[carsList].quantity
    const km = document.querySelector('#km').value

    const data = {
        price: price,
        result: result,
        yearOfReceiptOfDrivingLicense: yearOfReceiptOfDrivingLicense,
        newyearOfReceiptOfDrivingLicense: newyearOfReceiptOfDrivingLicense,
        categorySelected: categorySelected,
        carsQuantity: carsQuantity,
        km: km,
        dateRental: dateRental,
        dateDelivery: dateDelivery
    }
    return data;
}

button.addEventListener('click', () => {
    const data = getCarRentCost();

    switch (data.categorySelected) {
        case 'basic':
            data.price *= pricecategory.basic
            break
        case 'standard':
            data.price *= pricecategory.standard
            break
        case 'medium':
            data.price *= pricecategory.medium
            break
        case 'premium':
            data.price *= pricecategory.premium
            break
        default:
            data.price *= pricecategory.default
    }

    if (data.km.length == 0 || data.yearOfReceiptOfDrivingLicense.length == 0 || data.dateRental.length == 0 || data.dateDelivery.length == 0) {
        document.querySelector("#info").innerHTML = "Wypełnij wszystkie pola"
    } else {
        if (data.newyearOfReceiptOfDrivingLicense < 5) {
            if (data.newyearOfReceiptOfDrivingLicense < 3 && data.categorySelected == "premium") {
                info.innerHTML = `Nie możesz wypożyczyć tego samochodu !!!`
            } else {
                if (data.quantity < 3) {
                    data.price *= 1.2
                    const fuelCostSummary = (data.km / 100) * fuelConsumption * fuelCostInPln
                    data.price += fuelCostSummary
                    const netto = (data.result * rentalPriceInPln + data.price) * 1.15
                    const brutto = netto * vatValue
                    info.innerHTML = `cena brutto: ${brutto.toFixed(2)} a cena netto to ${netto.toFixed(2)} <br> Cena paliwa: ${fuelCostSummary}zł  Kwota Bazowa: ${rentalPriceInPln}zł`
                } else {
                    data.price *= 1.2
                    const fuelCostSummary = (data.km / 100) * fuelConsumption * fuelCostInPln
                    data.price += fuelCostSummary
                    const netto = (data.result * rentalPriceInPln + data.price)
                    const brutto = netto * vatValue
                    info.innerHTML = `cena brutto: ${brutto.toFixed(2)} a cena netto to ${netto.toFixed(2)} <br> Cena paliwa: ${fuelCostSummary}zł  Kwota Bazowa: ${rentalPriceInPln}zł`
                }
            }
        } else {
            const fuelCostSummary = (data.km / 100) * fuelConsumption * fuelCostInPln
            data.price += fuelCostSummary
            const netto = (data.result * rentalPriceInPln + data.price)
            const brutto = netto * vatValue
            info.innerHTML = `cena brutto: ${brutto.toFixed(2)} a cena netto to ${netto.toFixed(2)} <br> Cena paliwa: ${fuelCostSummary}zł  Kwota Bazowa: ${rentalPriceInPln}zł`
        }
    }
})