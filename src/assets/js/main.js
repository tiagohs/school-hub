(function($) {
    "use strict";

    function isScrolledIntoView(elem)
    {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    /******************************** 
        Menu Fixed while scrolling
    *********************************/
    if ($(window).scrollTop() >= 60) {
        $('#header-menu').addClass('header-menu-fixed');
    } else {
        $('#header-menu').removeClass('header-menu-fixed');
    }

    $(window).on('scroll', function() {
        if ($(window).scrollTop() >= 60) {
            $('#header-menu').addClass('header-menu-fixed');
        } else {
            $('#header-menu').removeClass('header-menu-fixed');
        }

        if (isScrolledIntoView($('.about-us-statistics'))) {
            
            $('.counter').each(function () {
                var value = $(this).attr("number");
                $(this).prop('Counter', 0).animate({
                    Counter: value
                }, {
                    duration: 1000,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    }
                });
            });
        }
    });

    /******************************** 
        Scroll Sections
    *********************************/

   $.scrollIt({         
    easing: 'swing',      
    scrollTime: 600,       
    activeClass: 'active',  
  });

    
    $('.vertical-slide').not('.slick-initialized').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        vertical: true,
        prevArrow: '#top-arrow',
        nextArrow: '#bottom-arrow'
    });

    $('#slide-horizontal').not('.slick-initialized').slick({
        infinite: false,
        slidesToShow: 2,
        slidesToScroll: 2,
        prevArrow: '#prev-arrow',
        nextArrow: '#next-arrow',
        dots: true,
        touchMove: true,
        responsive: [
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
              }
            }
          ]
    });

    $('#slide-courses').not('.slick-initialized').slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        prevArrow: '#c-prev-arrow',
        nextArrow: '#c-next-arrow',
        dots: true,
        touchMove: true,
        responsive: [
            {
                breakpoint: 576,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  infinite: true,
                  dots: true
                }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true
              }
            },
            {
                breakpoint: 1200,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                  infinite: true,
                  dots: true
                }
              },
          ]
    });

    /******************************** 
        Scroll Reveal Configuration
    *********************************/

   window.sr = new ScrollReveal({ 
    reset: false });

    sr.reveal('.about-us', { duration: 400 });
    sr.reveal('.statistics', { duration: 400 });
    sr.reveal('.about-us-testimonials', { duration: 400 });
    sr.reveal('.courses', { duration: 400 });
    sr.reveal('.subscribe', { duration: 400 });
})(jQuery);

    