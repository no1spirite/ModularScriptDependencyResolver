var Common = {};

Common.defaults = {
    type: {
        0: 'Fundraiser',
        1: 'Charity',
        2: 'Content',
        3: 'Message',
        4: 'DonationPrompt',
        5: 'Description',
        100: 'Placeholder'
    },
    deviceType: {
        'phone': 0,
        'tablet': 1,
        'desktop': 2
    },
    colCount: 4,
    colWidth: 0,
    margin: 0,
    containerWidth: 0,
    columns: [],
    imageServer: "https://d2cme1q4f44ryr.cloudfront.net/Utils/imaging.ashx?width=364&imageType=frpphoto&img="
};

Common.fn = {
    getDeviceType : function() {
        return Common.defaults.deviceType[window.getComputedStyle(document.body, ':after').getPropertyValue('content')];
    },
    isNullOrWhitespace: function (input) {
        if (input == null) {
            return true;
        }
        return input.replace(/\s/g, '').length < 1;
    }
};

Array.min = function (array) {
    return Math.min.apply(Math, array);
};

Array.max = function (array) {
    return Math.max.apply(Math, array);
};