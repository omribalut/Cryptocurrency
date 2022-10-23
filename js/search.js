//Search Input - Keypress to show result
$("#coin-search").on("keyup", function (e) {
        $("#coin-search").empty()
        e.preventDefault()
        let myValue = $('#coin-search').val().toLowerCase()

        let newCoinsArrayForSearch = coinsToSearch.filter(obj => {
            return obj.symbol.toLowerCase().includes(myValue)
        })
        $(".row").html("")
        printCoins(newCoinsArrayForSearch)
}

)