///<reference path="~/Scripts/vendor/jquery-1.8.2.js" />
///<reference path="~/Scripts/vendor/knockout-2.2.0.debug.js"/>

ko.bindingHandlers['height-one-way'] = {
    init: function (element, valueAccessor) {
        var modelValue = valueAccessor();

        modelValue(element.scrollHeight);
    },
    update: function (element, valueAccessor, allBindings) {
        var modelValue = valueAccessor();

        modelValue(element.scrollHeight);
    }
};

ko.bindingHandlers['height-two-way'] = {
    init: function (element, valueAccessor) {
        var modelValue = valueAccessor();

        if ($(element).height() !== modelValue()) {
            $(element).height(modelValue());
        }

        modelValue(element.scrollHeight);
    },
    update: function (element, valueAccessor, allBindings) {
        var modelValue = valueAccessor();

        if ($(element).height() !== modelValue()) {
            $(element).height(modelValue());
        }

        modelValue(element.scrollHeight);
    }
};