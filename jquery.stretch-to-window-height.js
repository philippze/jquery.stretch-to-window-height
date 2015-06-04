/** Copyright Philipp Zedler. MIT License **/
(function ($) {

    "use strict";

    var Stretcher = function ($collection) {
        this.$stretching_elements = $collection;
        this.extra_height = 0;
        this.maximize_margins();
        this.register_margins();
        var stretcher = this;
        $(window).load(function () {
            stretcher.resize_procedure();
        });
        $(window).resize(function () {
            stretcher.resize_procedure();
        });
    };

    Stretcher.prototype = {
        maximize_margins: function () {
            var stretcher = this;
            this.$stretching_elements.each(function () {
                stretcher.maximize_margin($(this));
            });
        },
        maximize_margin: function ($element) {
            /** Anihilate disturbing effect of overlapping margins **/
            var margin_top = this.get_margin_top($element);
            var margin_bottom = this.get_margin_bottom($element);
            if ($element.css('float') === 'none') {
                margin_top = Math.max(
                    margin_top,
                    this.get_margin_bottom($element.prev())
                );
                margin_bottom = Math.max(
                    margin_bottom,
                    this.get_margin_top($element.next())
                );
                $element.css({
                    'margin-top': margin_top + 'px',
                    'margin-bottom': margin_bottom + 'px'
                });
            }
        },
        register_margins: function () {
            var stretcher = this;
            this.$stretching_elements.each(function () {
                stretcher.register_margin($(this));
            });
        },
        register_margin: function ($element) {
            $element.data({'margin-top': this.get_margin_top($element)});
            $element.data({'margin-bottom': this.get_margin_bottom($element)});
        },
        get_margin_top: function ($element) {
            return this.get_margin($element, 'margin-top');
        },
        get_margin_bottom: function ($element) {
            return this.get_margin($element, 'margin-bottom');
        },
        get_margin: function ($element, margin_name) {
            var margin = $element.css(margin_name);
            margin = parseInt(margin);
            if (isNaN(margin)) {
                margin = 0;
            }
            return margin;
        },
        resize_procedure: function () {
            if (this.requires_stretching()) {
                this.stretch();
            }
        },
        requires_stretching: function () {
            return $('body').height() - this.extra_height < $(window).height();
        },
        stretch: function () {
            this.set_stretch_amount();
            this.set_extra_height();
            this.set_stretch_per_margin();
            this.stretch_elements();
        },
        set_stretch_amount: function () {
            this.stretch_amount = $(window).height() - $('body').height() + this.extra_height;
        },
        set_extra_height: function () {
            this.extra_height = this.stretch_amount;
        },
        set_stretch_per_margin: function () {
            var num_stretching_elements = this.$stretching_elements.length;
            var num_margins = 2.0 * num_stretching_elements;
            this.stretch_per_margin = this.stretch_amount / num_margins;
        },
        stretch_elements: function () {
            var stretcher = this;
            this.$stretching_elements.each(function () {
                stretcher.stretch_element($(this));
            });
        },
        stretch_element: function ($element) {
            var margin_bottom = $element.data('margin-bottom'),
                margin_top = $element.data('margin-top');
            margin_bottom = (margin_bottom + this.stretch_per_margin) + 'px';
            margin_top = (margin_top + this.stretch_per_margin) + 'px';
            $element.css({
                'margin-bottom': margin_bottom,
                'margin-top': margin_top
            });
        }
    };

    $.fn.stretchToWindowHeight = function () {
        new Stretcher($(this));
    };

}(jQuery));
