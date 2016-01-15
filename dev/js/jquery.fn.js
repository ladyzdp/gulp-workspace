;
(function($) {

  $.fn.extend({
    "color": function(value) {
      return this.css("color", value);
    },
    "tableBgClolr": function(option) {
      option = $.extend({
        odd: "odd",
        even: "even",
        selected: "selected"

      }, option);

    }
  });

})(jQuery)
