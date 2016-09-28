(function($){
    'use strict';

    var WpCarousel = function($gallery, settings){
        this.$gallery =  $gallery;
        this.settings = settings;
    };

    WpCarousel.prototype = {
        setLargeImage: function(thumbIdx){
            var $largeImage = $(this.largeImages[thumbIdx]);
            this.largeImages.removeClass(this.largeImgActiveClass);
            $largeImage.addClass(this.largeImgActiveClass);
        },
        slide: function(step){
            step = Math.abs(step);
            var offset = -1 * step * this.thmbItemSize;
            this.$thmbSlider.css({'left': offset});
        },
        getStep: function(currentIdx){
            var step = 0;
            if(currentIdx < this.treshold) {
                step = 0;
            }
            else if(currentIdx >= (this.thmbItemsCount - this.treshold)){
                step = this.thmbItemsCount - this.visibleItemsNb;
            }
            else{
                step = currentIdx - this.treshold;
            }
            return step;
        },
        setNavBtns: function(idx){
            if(idx === 0) {
                this.$prevBtn.css({'visibility': 'hidden'});
            }   
            else if(idx === this.$thmbItems.length - 1){
                this.$nextBtn.css({'visibility': 'hidden'});
            }
            else{
                this.$prevBtn.css({'visibility': 'visible'});
                this.$nextBtn.css({'visibility': 'visible'});
            }
        },
        moveOnClick: function($item){
            var itemIdx = $item.index(),
                step = this.getStep(itemIdx);
            this.switchActive($item);
            this.slide(step);
            this.setLargeImage(itemIdx);
            this.setNavBtns(itemIdx);
        },
        switchActive: function($item){
            if($item.hasClass(this.activeItemClass)){
                return false;
            }
            else{
                this.$thmbItems.removeClass(this.activeItemClass);
                $item.addClass(this.activeItemClass);
            }
        },

        init: function(){
            var that = this;
            this.$thmbContainer = this.$gallery.find('.' + this.settings.thmbInnerClass);
            this.$thmbItems = this.$gallery.find('.' + this.settings.thmbItemClass);
            this.$thmbItem = $(this.$thmbItems[0]);
            this.thmbItemWidth = this.$thmbItem.width();
            this.thmbItemMargin = parseFloat(this.$thmbItem.css('margin-left')) + parseFloat(this.$thmbItem.css('margin-right'));
            this.thmbItemSize = this.thmbItemWidth + this.thmbItemMargin;
            this.thmbItemsCount = $(this.$thmbItems).length;
            this.$thmbSlider = this.$gallery.find('.' + this.settings.thmbSliderClass);
            this.visibleItemsNb = Math.ceil(this.$thmbContainer.width() / this.thmbItemSize);
            this.treshold = Math.floor(this.visibleItemsNb / 2);
            this.activeItemClass = this.settings.activeThmbClass;
            this.largeImgActiveClass = this.settings.largeImgActiveClass;
            this.$prevBtn = this.$gallery.find('.' + this.settings.thmbNavPrevClass);
            this.$nextBtn = this.$gallery.find('.' + this.settings.thmbNavNextClass);
            this.largeImages = this.$gallery.find('.' + this.settings.largeImagesClass);            
            
            $(this.$thmbSlider).css({'width': this.thmbItemsCount * this.thmbItemSize });
            $(this.$thmbItems[0]).addClass(this.activeItemClass);
            this.setNavBtns(0);

            this.$thmbItems.on('click', function(e){
                e.preventDefault();
                var $item = $(this);
                that.moveOnClick($item);
            });
            this.$prevBtn.on('click', function(e){
                e.preventDefault();
                var $item = that.$gallery.find('.' + that.activeItemClass).prev();
                $item.index() >= 0 && that.moveOnClick($item);
            });
            this.$nextBtn.on('click', function(e){
                e.preventDefault();
                var $item = that.$gallery.find('.' + that.activeItemClass).next();
                $item.index() >= 0 && that.moveOnClick($item);
            });         
        }
    };
    
    $.fn.wpCarousel = function(options){
        var settings = $.extend({
                thmbItemClass: 'gallery__thumbnails__item',
                thmbInnerClass: 'gallery__thumbnails__inner',
                thmbSliderClass: 'gallery__thumbnails__inner__slider',
                activeThmbClass: 'gallery__thumbnails__item--active',
                largeImgActiveClass: 'gallery__top__item--visible',
                thmbNavPrevClass: 'gallery__thumbnails__nav__prev',
                thmbNavNextClass: 'gallery__thumbnails__nav__next',
                largeImagesClass: 'gallery__top__item'
            }, options);

            return this.each(function() {
                var $gallery = $(this),
                    wpCarousel = new WpCarousel($gallery, settings); 
                wpCarousel.init();
            });            
    }

})(jQuery);