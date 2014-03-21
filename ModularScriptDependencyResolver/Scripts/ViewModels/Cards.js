///<reference path="~/Scripts/vendor/jquery-1.8.2.js" />
///<reference path="~/Scripts/vendor/knockout-2.2.0.debug.js"/>

///<reference path="~/Scripts/viewModels/Card.js"/>
///<reference path="~/Scripts/extensions/common.js"/>

var Cards = function (totalCardsCount) {
    var self = this;
    this.min = 0;
    this.index = 0;
    this.cardCount = ko.observable(0);
    this.totalCardCount = totalCardsCount;
    this.cards = ko.observableArray([]);
    this.cardsThatWontFitYet = [];
    this.containerHeight = ko.observable(0);
    this.loading = ko.observable(false);
    
    this.update = function (cardsJson) {
        self.cardCount(cardsJson.length);
        $.each(cardsJson, function (key, value) {
            var card = new Card(self.cards().length);
            card.update(value);
            var positionSet = setCardPosition(card);
            if (positionSet === true) {
                self.cards.push(card);
            }
        });
        checkCardsThatWontFit();
        setContainerHeight();
    };

    this.refresh = function () {
        self.min = 0;
        self.index = 0;
        $.each(self.cards(), function (key, value) {
            setCardPosition(value);
            self.saveColumnHeight($('#' + value.id()), value.columnCount());
        });
        checkCardsThatWontFit();
        setContainerHeight();
    };

    this.saveColumnHeight = function ($element, cardColumnCount) {
        if ($element.length > 0) {
            for (var i = 0; i < cardColumnCount; i++) {
                Common.defaults.columns[self.index + i] = self.min + $element.get(0).clientHeight + Common.defaults.margin;
            }
        }
    };

    this.hasMore = ko.computed(function() {
        return self.totalCardCount > self.cards().length;
    });

    var setContainerHeight = function () {
        var size = !window.getComputedStyle ? 'desktop' : window.getComputedStyle(document.body, ':after').getPropertyValue('content');        
        if (size !== 'phone') {
            return self.containerHeight(Array.max(Common.defaults.columns));
        } else {
            return self.containerHeight("auto");
        }
    };

    var checkCardsThatWontFit = function() {
        if (self.cardsThatWontFitYet.length > 0) {
            for (var i = 0; i < self.cardsThatWontFitYet.length; i++) {
                var cardThatWouldntFit = self.cardsThatWontFitYet.shift();
                var positionSet = setCardPosition(cardThatWouldntFit);
                if (positionSet === true) {
                    self.cards.push(cardThatWouldntFit);
                }
                else if (self.cards().length + self.cardsThatWontFitYet.length === self.cardCount) {
                    self.cards.push(self.cardsThatWontFitYet.shift());
                }
            }
        }
    };

    var setCardPosition = function (card) {
        var doesFit = false;
        self.min = Array.min(Common.defaults.columns);
        self.index = $.inArray(self.min, Common.defaults.columns);

        if (card.columnCount() + self.index > Common.defaults.colCount) {
            self.index = 0;
            self.min = Common.defaults.columns[self.index];
        }

        for (var i = 0; i < card.columnCount(); i++) {
            doesFit = Common.defaults.columns[self.index + i] === self.min;
        }

        if (doesFit) {
            var leftPos = Common.defaults.margin + (self.index * (Common.defaults.colWidth + Common.defaults.margin));
            card.setPosition(leftPos, self.min);
            checkCardsThatWontFit();
            return true;
        } else {
            self.cardsThatWontFitYet.push(card);
            return false;
        }
    };
}