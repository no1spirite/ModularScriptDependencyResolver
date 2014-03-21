///<reference path="~/Scripts/vendor/jquery-1.8.2.js" />
///<reference path="~/Scripts/vendor/knockout-2.2.0.debug.js"/>

///<reference path="~/Scripts/viewModels/Cards.js"/>
///<reference path="~/Scripts/extensions/common.js"/>

var CardsController = {
    init: function (cardsJson) {
        var test = "";
        CardsController.setupCards(function () {
            CardsController.setBindings(cardsJson);
            if (CardsController.defaults.infiniteScroll === true) {
                CardsController.setScroll();
                CardsController.defaults.killScroll = false;
            }

            // refresh the cards when the window is resized.
            $(window).resize(CardsController.refresh);

            // refresh the cards once all resources loaded because web fonts is causing issues.
            $(window).bind("load", function () {
                CardsController.refresh();
            });
        });
    },
    setBindings: function (cardsJson) {
        this.cardsViewModel = new Cards(
            (CardsController.defaults.maxCardsCount === 0 || cardsJson.TotalResultSetSize < CardsController.defaults.maxCardsCount)
            ? cardsJson.TotalResultSetSize
            : CardsController.defaults.maxCardsCount);
        ko.applyBindings(CardsController, $(CardsController.defaults.$container).get(0));
        this.cardsViewModel.update(cardsJson.Collection);
    },
    setScroll: function () {
        $(window).scroll(function () {
            if ($(window).scrollTop() + 1500 >= ($(document).height() - ($(window).height()))) {
                if (CardsController.defaults.killScroll == false) {
                    CardsController.defaults.killScroll = true;
                    CardsController.getMore(null, null, function () {
                        CardsController.defaults.killScroll = false;
                    });
                }
            }
        });
    },
    afterInitialCardRender: function (element) {
        $(element).hide().fadeIn(500);
        var colCount = $(element).parent().attr('data-col-count') || 1;
        CardsController.cardsViewModel.saveColumnHeight($(element).parent('.content'), colCount);
    },
    getMore: function (data, element, callback) {
        if (CardsController.defaults.maxCardsCount === 0 || CardsController.defaults.maxCardsCount > CardsController.cardsViewModel.cards().length) {
            if (CardsController.cardsViewModel.hasMore()) {
                CardsController.cardsViewModel.loading(true);
                CardsController.defaults.page++;
                CardsController.defaults.ajaxData['page'] = CardsController.defaults.page;
                $.ajax({
                        url: CardsController.defaults.ajaxGetMethod,
                        type: "GET",
                        data: CardsController.defaults.ajaxData
                    })
                    .done(function (cardsJson) {
                        if (cardsJson.Collection.length === 0) {
                            CardsController.cardsViewModel.totalCardCount = 0;
                        } else {
                            CardsController.cardsViewModel.update(cardsJson.Collection);
                        }
                        
                        CardsController.cardsViewModel.loading(false);
                        if (callback !== undefined) {
                            callback();
                        }
                    });
            }
        }
    },
    refresh: function () {
        CardsController.setupCards(function () {
            CardsController.cardsViewModel.refresh();
        });
    },
    setupCards: function (callback) {
        Common.defaults.containerWidth = $(CardsController.defaults.$cardsContainer).width();
        Common.defaults.colWidth = Common.defaults.containerWidth / Common.defaults.colCount;
        Common.defaults.columns = [];
        for (var i = 0; i < Common.defaults.colCount; i++) {
            Common.defaults.columns.push(Common.defaults.margin);
        }

        if (callback !== undefined) {
            callback();
        }
    },
    defaults: {
        $cardsContainer: '.cards-wrap-js',
        $content: '.content',
        $container: '.cards',
        killScroll: true,
        infiniteScroll: false,
        ajaxGetMethod: "",
        ajaxData: {},
        page: 1,
        maxCardsCount: 0, // zero means infinite
        data: {}
    }
};

