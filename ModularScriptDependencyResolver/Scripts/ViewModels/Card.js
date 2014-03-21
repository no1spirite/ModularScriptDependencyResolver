///<reference path="~/Scripts/vendor/knockout-2.2.0.debug.js"/>

///<reference path="~/Scripts/extensions/common.js"/>

var Card = function (id) {
    var self = this;

    this.left = ko.observable(20);
    this.top = ko.observable(20);
    //this.height = ko.observable(0);
    this.columnCount = ko.observable(1);

    //Common properties
    this.id = ko.observable(id);
    this.cardType = ko.observable("");
    this.pageUrl = ko.observable("");
    this.eventName = ko.observable("");
    this.displayName = ko.observable("");
    this.photoUrl = ko.observable("");
    this.resonatingReason = ko.observable("");
    this.resonatingReasonQuantity = ko.observable("");
    this.fundraisingVerb = ko.observable("");
    this.charityName = ko.observable("");
    this.charityUrl = ko.observable("");

    //Fundraiser properties
    this.totalRaisedFormatted = ko.observable("");
    this.validDonations = ko.observable("");
    this.isDeleted = ko.observable("");
    this.pageSummaryWhat = ko.observable("");
    this.pageSummaryWhy = ko.observable("");
    this.inMemoryPersonName = ko.observable("");
    this.pageOwnerFullName = ko.observable("");

    //Message properties
    this.message = ko.observable("");
    this.amount = ko.observable("");
    this.giftAid = ko.observable("");
    this.author = ko.observable("");
    this.date = ko.observable("");
    this.currencySymbol = ko.observable("");

    //Description properties
    this.description = ko.observable("");
    this.regNumber = ko.observable("");
    this.dateJoined = ko.observable("");
    this.websiteUrl = ko.observable("");
    this.emailAddress = ko.observable("");

    //Hero properties
    this.ribbon = ko.observable("");
    this.title = ko.observable("");
    this.body = ko.observable("");

    //Donation prompts properties
    this.prompts = ko.observableArray([]);
    this.promptType = ko.observable("");

    //NOTE: some of these computed observables will be moved to the server and deprecated
    this.pureGridClass = ko.computed(function () {
        switch (self.columnCount()) {
            case 1:
                return "pure-u-1-4";
            case 2:
                return "pure-u-1-2";
            default:
                return "pure-u-1-4";
        }
    });

    this.charityFooter = ko.computed(function () {
        return self.displayName() + ' Registered charity number ' + self.regNumber();
    });

    this.dateFooter = ko.computed(function () {
        return 'On JustGiving since ' + self.dateJoined();
    });

    this.isCardType = function (cardType) {
        return Common.defaults.type[self.cardType()] == Common.defaults.type[cardType];
    };

    this.websiteFriendlyUrl = ko.computed(function () {
        return self.websiteUrl() ? self.websiteUrl().replace(/.*?:\/\//g, "") : null;
    });

    this.pageSummaryWithFallback = ko.computed(function () {
        return self.eventName();
    });

    this.dataLabel = function () {
        return "resonating-fundraising-page-by-" + self.resonatingReason() + "-in-24hours-image-fundraiser-image-" + self.cardType();
    };

    this.dataLabelLink = function () {
        return "resonating-fundraising-page-by-" + self.resonatingReason() + "-in-24hours-image-fundraiser-link-" + self.cardType();
    };

    //NOTE: if the amount of properties gets too big we could think about switch statements or even javascript prototypes
    this.update = function (cardJson) {
        self.cardType(cardJson.CardType);
        self.columnCount(cardJson.ColumnCount || 1);

        //Common properties
        self.pageUrl(cardJson.Data.PageUrl);
        self.eventName(cardJson.Data.EventName);
        self.displayName(cardJson.Data.DisplayName || cardJson.Data.PageOwnerFullName);
        self.photoUrl(cardJson.Data.PhotoUrl);
        self.resonatingReason(cardJson.ResonatingReason);
        self.resonatingReasonQuantity(cardJson.ResonatingReasonQuantity);
        self.fundraisingVerb(cardJson.Data.FundraisingVerb);
        self.charityName(cardJson.Data.CharityName);
        self.charityUrl(cardJson.Data.CharityLink);

        switch (cardJson.CardType) {
            case 0:
                //Fundraiser properties
                self.totalRaisedFormatted(cardJson.Data.TotalRaisedFormatted);
                self.validDonations(cardJson.Data.ValidDonations);
                self.isDeleted(cardJson.Data.IsDeleted);
                self.pageSummaryWhat(cardJson.Data.PageSummaryWhat);
                self.pageSummaryWhy(cardJson.Data.PageSummaryWhy);
                self.inMemoryPersonName(cardJson.Data.InMemoryPersonName);
                self.pageOwnerFullName(cardJson.Data.PageOwnerFullName);
                break;
            case 2:
                //Hero properties
                self.ribbon(cardJson.Data.Ribbon);
                self.title(cardJson.Data.Title);
                self.body(cardJson.Data.Body);
                break;
            case 3:
                //Message properties
                self.message(cardJson.Data.Message);
                self.amount(cardJson.Data.AmountDonated);
                self.giftAid(cardJson.Data.GiftAid);
                self.author(cardJson.Data.Author);
                self.date(cardJson.Data.Date);
                self.currencySymbol(cardJson.Data.CurrencySymbol);
                break;
            case 4:
                //Donation prompt properties
                self.prompts(cardJson.Data);
                if (cardJson.Data.length > 0 && cardJson.Data[0].DonationPromptType !== undefined) {
                    self.promptType(cardJson.Data[0].DonationPromptType);
                }
                break;
            case 5:
                //Description properties
                self.description(cardJson.Data.Description);
                self.regNumber(cardJson.Data.RegNumber);
                self.dateJoined(cardJson.Data.DateJoined);
                self.websiteUrl(cardJson.Data.WebsiteUrl);
                self.emailAddress(cardJson.Data.EmailAddress);
                break;
            default:
        }
    };

    this.setPosition = function (left, top) {
        self.left(left);
        self.top(top);
    };
}