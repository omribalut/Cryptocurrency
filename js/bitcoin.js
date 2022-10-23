//Go To Homepage
$(".title").attr("href", "bitcoin.html")

//Activate API call to see coins
$(".home").on("click", function(){
    $(".row").fadeIn("slow")
    $(".about-card").fadeOut("slow")
})

//Get the coins API
let coinsToSearch = []
getCoins()

function getCoins() {
    showProgress()
    $.ajax({
        url: ("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false.coingecko.com/api/v3/coins/list"),
        type: "GET",
    })
        .then((coinsData) => {
        
            coinsData.forEach((obj, idx) => {
                if (idx < 100) {
                    coinsToSearch.push(obj)

                }
            })
            hideProgress()
            printCoins(coinsData)

        })
    $(".about-card").hide()
}

function renderMoreInfo(coinId, coinData) {
    const moreInfoElement = `#${coinId}-more-info`;
    const moreInfoDetailsElement = `#${coinId}-coin-details`;

    if ($(moreInfoElement).is(':empty')) {
        $(moreInfoElement).append(`<div id=${moreInfoDetailsElement}></div>`);
        $(moreInfoElement).append(`<img id="coin-img" src="${coinData.image.small}"/>`);
        $(moreInfoElement).append(`<p id="usd">Dollar Currency: ${coinData.market_data.current_price.usd.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}$</p>`);
        $(moreInfoElement).append(`<p id="eur">Euro Currency: ${coinData.market_data.current_price.eur.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}€</p>`);
        $(moreInfoElement).append(`<p id="ils">Shekel Currency: ${coinData.market_data.current_price.ils.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}₪</p>`);
    }
}

function showMoreInfo(myId) {
    showProgress()
    const cachedCoinData = JSON.parse(localStorage.getItem(`${myId}`))

    if (!cachedCoinData) {
        $.ajax({
            url: (`https://api.coingecko.com/api/v3/coins/${myId}`),
            type: "GET",

        })
            .then((coinData) => {
                renderMoreInfo(myId, coinData)
                return coinData;
            })
            .then((coinData) => {
                localStorage.setItem(`${myId}`, JSON.stringify(coinData));
                setTimeout(() => localStorage.removeItem(`${myId}`), 1000 * 60 * 2);
                hideProgress()
            })
        return;
    }

    renderMoreInfo(myId, cachedCoinData);
    hideProgress()
}

function handleMoreInfo() {
    const coinId = $(this).attr("id")
    const moreInfoElement = `#${coinId}-more-info`;
    const display = $(moreInfoElement).css("display");

    if (display === "none") {
        showMoreInfo(coinId);
        $(moreInfoElement).fadeIn(500);
    }
    else {
        $(moreInfoElement).fadeOut(500);
    }
}


function printCoins(coinsData) {
    $(".row").empty()
    coinsData.forEach((element, idx) => {
        if (idx < 100) {
            const divToPush =
                $(`<div class="col col-lg-2 col-md-4 col-sm-6 navbar-collapse" id =>
    <p class="symbol"> ${element.symbol}</p>
    <p class="name"> ${element.name}</p>
    <br>
    <br>
    <div id="${element.id}-more-info" style="display: none"></div>
    <button class="info btn btn-warning" id = "${element.id}">More Info</button>
    <br>
    <label class="switch">
            <input type="checkbox" class="toggleCoin" id="switchCheck" inputCoinSymbol=${element.symbol.toUpperCase()}>
            <span class="slider round"></span>
        </label>
        </div>
    `)

            $(".row").append(divToPush).fadeIn("slow")
        }
    }
    )
}

//More Info
$(".row").on("click", ".info", handleMoreInfo)

//Toggle
let checkedCoinsArr = []

$('.row').on('change', '#switchCheck', function () {
    if ($(this).is(':checked')) {
        if (checkedCoinsArr.length < 5) {
            checkedCoinsArr.push($(this).attr('inputCoinSymbol'))
        } else {
            $(this).prop("checked", false);
            showCheckedCoins(checkedCoinsArr);
        }
    } else if (!$(this).is(':checked')) {
        const CoinRemove = checkedCoinsArr.indexOf($(this).attr('inputCoinSymbol'));
        if (CoinRemove > -1) {
            checkedCoinsArr.splice(CoinRemove, 1);
        }
    }
    console.log(checkedCoinsArr);
})


const showCheckedCoins = (checkedCoinsArr) => {
    $('.tooManyPicked').html('')
    for (let i = 0; i < checkedCoinsArr.length; i++) {
        let coinPushToRemovedArr = $(`
      <div class="symbolRemove">
          <li><u>${checkedCoinsArr[i]}</u></li><button id = "btn-remove-coin" type="button" class="btn btn-outline-warning"
          background-color: rgb(255 0 0);" classCoinData = "${checkedCoinsArr[i]}">Remove Coin</button></div>
      
  `)
        $('.tooManyPicked').append(coinPushToRemovedArr)
    }
    removeHidden()
}

$('.closeRemoveBtn').on('click', () => {
    $('.tooManyCoins').addClass('hide')
})

$('.tooManyCoins').on('click', '#btn-remove-coin', function () {

    const CoinRemove = checkedCoinsArr.indexOf($(this).attr('classCoinData'));
    if (CoinRemove > -1) {
        checkedCoinsArr.splice(CoinRemove, 1);
        $(`input[inputCoinSymbol = ${$(this).attr('classCoinData')}]`).prop("checked", false);
    }
    showCheckedCoins(checkedCoinsArr)
    if (checkedCoinsArr.length === 0) {
        $('.tooManyCoins').addClass('hide')
    }
})

const removeHidden = () => {
    $('.tooManyCoins').removeClass('hide')
}


