(function ($, Drupal) {
  Drupal.behaviors.customBehavior = {
    attach: function (context, settings) {
      $('.publication-view .layout-custom-first').each(function() {
        if($(this).find('img').length) {
          $(this).parent().addClass('cover-image');
        }
      });
    }
  };
})(jQuery, Drupal);