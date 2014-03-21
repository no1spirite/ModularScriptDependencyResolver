///<reference path="~/Scripts/controllers/cards-controller.js"/>

(function (cardsJson) {
    var ts = "";
    CardsController.defaults.infiniteScroll = true;
    CardsController.defaults.ajaxGetMethod = window.location.href + "/getcards";
    CardsController.defaults.maxCardsCount = 40;
    CardsController.defaults.data['charityName'] = cardsJson.charityName;
    CardsController.init(cardsJson);
})(cardsJson);