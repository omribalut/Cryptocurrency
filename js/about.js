
$(".about").on("click", about)

function about() {
    showProgress()

    const details = $(`
    <p><u>Omri Blutstein</u>
    <br></p>

    <p>Full Stack Web Developer:
    <br>
    jQuery-AJAX API Project</p>
    </p>
    `)
    $(".about-card").empty()
    $(".about-card").append(details).slideToggle("slow")
    hideProgress()
    $(".row").hide()
    $("#coin-details").hide()

}