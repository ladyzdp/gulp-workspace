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

      $("tbody > tr:odd", this).addClass(option.odd);
      $("tbody > tr:even", this).addClass(option.even);
      $("tbody > tr", this).click(function(event) {
        var hasSelected = $(this).hasClass(option.selected);

        $(this)[hasSelected ? "removeClass" : "addClass"](option.selected).find(':checkbox').attr('checked', !hasSelected);
        return this;
      });
    }




    
  });

})(jQuery)
