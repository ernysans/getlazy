;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lend', 'occurrence'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('lend'), require('occurrence'));
    } else {
        root.getLazy = factory(root.lend, root.occurrence);
    }
}(this, function(lend, occurrence) {
    /*!
     * getLazy v0.1: Lightweight lazy loading content script.
     * (c) 2016 Erny Sans
     * 
     * http://github.com/ernysans/getlazy
     * http://erny.co
     * MIT License
     */

    'use strict';

    // Reference attributes
    var ref = {};
    ref.selector = ".getLazy";
    ref.errorClass = "getLazy__error";
    ref.successClass = "getLazy__loaded";
    // Item base attributes
    var src = {};
    src.current = "src";
    src.base = "data-src";
    src.hd = "data-src-hd";
    src.xl = "data-src-xl";
    src.lg = "data-src-lg";
    src.md = "data-src-md";
    src.sm = "data-src-sm";
    src.xs = "data-src-xs";
    src.type = "data-src-type";

    var screenSize = lend.screenSize('bootstrap');
    var screenDensity = lend.screenDensity();

    // Set top functions ======================================== //
    var onResize = occurrence.debounce(function(e) {
        e.preventDefault();
        screenSize = lend.screenSize('bootstrap');
        screenDensity = lend.screenDensity();
        reset();
    }, 1000);
    var reactFast = occurrence.debounce(function(e) {
        e.preventDefault();
        getLazyContent()
    }, 20);

    // Call lazy content ======================================== //
    function getLazy() {
        window.addEventListener('DOMContentLoaded', function(e) {
            e.preventDefault();
            getLazyContent();

            window.addEventListener('load', getLazyContent(), false);
            window.addEventListener('DOMSubtreeModified', reactFast, false);
            window.addEventListener('scroll', reactFast, false);
            window.addEventListener('resize', onResize, false);

        }, false);
    }

    // Reset loaded
    function reset() {
        var x = document.querySelectorAll(".getLazy__loaded");
        var i;
        for (i = 0; i < x.length; i++)
            clearLoaded(x[i]);
    }

    // Clear load class
    function clearLoaded(item) {
        if (item)
            item.classList.remove(ref.successClass);
        getSizes(item);
    }

    // Find all Items
    function getLazyContent() {
        var x = document.querySelectorAll(".getLazy[data-src]:not(.getLazy__loaded)");
        var i;
        for (i = 0; i < x.length; i++)
            getSizes(x[i]);
    }

    // Get the item tag size values
    function getSizes(item) {
        if (item)
            var i = {};
        i.base = item.getAttribute(src.base);
        i.hd = item.getAttribute(src.hd);
        i.xl = item.getAttribute(src.xl);
        i.lg = item.getAttribute(src.lg);
        i.md = item.getAttribute(src.md);
        i.sm = item.getAttribute(src.sm);
        i.xs = item.getAttribute(src.xs);
        i.type = item.getAttribute(src.type);

        var size = defineImageSize(i);
        var imgRoute = getImageRoute(i, size);

        // Get item offset
        var itemOffset = item.getBoundingClientRect();
        var itemOffsetTop = itemOffset.top; // these are relative to the viewport, i.e. the window

        // Set base offset
        var h = Math.max(window.innerHeight || document.documentElement.clientHeight || 0); // window height
        var baseOffset = (h + (h / 2));

        // Apply image if hasn't been set yet
        if (!item.classList.contains(ref.successClass) && itemOffsetTop <= baseOffset) setImage(imgRoute, i.type, item);
    }

    // Define the image size depending on the Screen Size and Screen Density
    function defineImageSize(item) {

        if (screenDensity == 'hd' || screenDensity == 'retina')
            if (item.xl && screenSize == 'xl') return 'hd';
            else if (item.lg && screenSize == 'lg') return 'xl';
        else if (item.md && screenSize == 'md') return 'lg';
        else if (item.sm && screenSize == 'sm') return 'md';
        else if (item.xs && screenSize == 'xs') return 'sm';
        else return 'base';
        else if (screenDensity == 'sd')
            if (item.xl && screenSize == 'xl') return 'xl';
            else if (item.lg && screenSize == 'lg') return 'lg';
        else if (item.md && screenSize == 'md') return 'md';
        else if (item.sm && screenSize == 'sm') return 'sm';
        else if (item.xs && screenSize == 'xs') return 'xs';
        else return 'base';
        else return 'base';
    }

    // Retrieve the image route
    function getImageRoute(item, size) {
        if (size == 'hd') return item.hd;
        else if (size == 'xl') return item.xl;
        else if (size == 'lg') return item.lg;
        else if (size == 'md') return item.md;
        else if (size == 'sm') return item.sm;
        else if (size == 'xs') return item.xs;
        else return item.base;
    }

    // Set the image
    function setImage(route, type, item) {
        if (type == 'background' && route)
            try {
                item.style.backgroundImage = 'url("' + route + '")';
                item.classList.add(ref.successClass, 'animated', 'fadeIn');
                item.classList.remove(ref.errorClass);
            }
        catch (err) {
            item.classList.add(ref.errorClass);
        } else if (!type && route)
            try {
                item.setAttribute('src', route);
                item.classList.add(ref.successClass, 'animated', 'fadeIn');
                item.classList.remove(ref.errorClass);
            }
        catch (err) {
            item.classList.add(ref.errorClass);
        }
    }
    return getLazy;
}));