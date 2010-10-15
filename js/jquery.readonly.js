/*
 * jquery-plugin Readonly
 *
 * Version 0.7
 * 
 * http://dev.powelltechs.com/jquery.readonly
 * http://plugins.jquery.com/project/readonly
 * 
 * Known good compatibility with jQuery 1.3.2
 *
 * Tested working with Firefox 3.0.8 (ubuntu) [ver0.7]
 * Tested working with Firefox 3.x (win2000) [ver0.7]
 * Tested working with Opera 9.64 (winXP) [ver0.7]
 * Tested working with Safari 4.30.17 (winXP) [ver0.7]
 * Tested working with Google Chrome 2.0 (winXP) [ver0.7]
 * Tested working with IE 8.0 (WinXP) [ver0.7]
 * Tested working with IE 7.0 (winXP) [ver0.7]
 * Tested working with IE 6.0 (win2000) [ver0.7]
 * Tested working with Konqueror 4.2.2 (Ubuntu 9.04) [ver0.7]
 * 
 *
 * Copyright (c) 2009 Charlie Powell
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
 
 
; // Yes, a random semicolon IS needed here, it's a jQuery thing.


/**
 * Global object to handle some internals of this function.
 */
window.com_powelltechs_readonly = window.com_powelltechs_readonly || {
  
  // Boolean if this objec has been 'initialized' yet.  Handled internally
  _hasBeenInit: false,
  
  // Elements currently set as readonly
  // This will be an array of objects, each object will have el, w, h, x, y
  // The various metatags will be used to check updated position from the timer.
  _elementsBound: [],
  
  // Just the interval pointer.
  _interval: 0,
  
  // The public init function.  Should be called from within the jQuery function.
  init: function(){
    if(this._hasBeenInit) return;
    //jQuery(window).bind('resize', window.com_powelltechs_readonly._updateAllElements);
    this._interval = setInterval(window.com_powelltechs_readonly._updateAllElements, 500);
    this._hasBeenInit = true;
  },
  
  // This is a pseudo-public function that will be called from within the scope of the window.
  //  This is an event listener fired off anytime the window is resized.
  //  should fix the bugs related to minimizing windows, reszing, etc...
  _updateAllElements: function(){
    // @notice the fully resolved path of the object, this MUST BE fully resolved,
    //  due to the fact that the window's scope lists 'this' as itself, not this object.
    for(i in window.com_powelltechs_readonly._elementsBound){
      // I'm using a for... in statement instead of the easier cleaner for each... in
      //  because SOME browser..... doesn't support for each....
      if(typeof(window.com_powelltechs_readonly._elementsBound[i]) == 'function') continue;
      window.com_powelltechs_readonly._updateOverlay(jQuery(window.com_powelltechs_readonly._elementsBound[i].el));
    }
  },
  
  // Another pseudo-public function that is fired off ever second or so.
  //  This checks all the elements currently under readonly control.
  _checkAllPositions: function(){
    for(i in window.com_powelltechs_readonly._elementsBound){
      // Shortcut so I'm not always accessing the variable from the fully resolved name.
      var elB = window.com_powelltechs_readonly._elementsBound[i];
      // I have the element saved in the object, so get that offsets first.
      var o = window.com_powelltechs_readonly._getDimensions(jQuery(elB.el));
      if(o.width != elB.w || o.height != elB.h || o.left != elB.x || o.top != elB.y){
        // Something isn't what it was, update that.
        window.com_powelltechs_readonly._updateOverlay(jQuery(elB.el));
        var oN = window.com_powelltechs_readonly._getDimensions(jQuery(elB.el));
        elB.w = oN.width;
        elB.h = oN.height;
        elB.x = oN.left;
        elB.y = oN.top;
      }
    }
  },
  
  // Get dimensions for a jQuery element.
  //  Internally function, but could probably be used by anything.
  // @return object { width, height, top, left }
  _getDimensions: function(el){
    var ret = {};
    
    // The multiple acquisitions of the CSS styles are required to cover any border and padding the elements may have.
    // The Ternary (parseInt(...) || 0) statements fix a bug in IE6 where it returns NaN,
    //  which doesn't play nicely when adding to numbers...
    ret.width = el.width() 
      + (parseInt(el.css('borderLeftWidth')) || 0)
      + (parseInt(el.css('borderRightWidth')) || 0)
      + (parseInt(el.css('padding-left')) || 0)
      + (parseInt(el.css('padding-right')) || 0);
    ret.height = el.height() 
      + (parseInt(el.css('borderTopWidth')) || 0) 
      + (parseInt(el.css('borderBottomWidth')) || 0)
      + (parseInt(el.css('padding-bottom')) || 0)
      + (parseInt(el.css('padding-bottom')) || 0);
    var offsets = el.offset();
    ret.left = offsets.left;
    ret.top = offsets.top;
    
    return ret;
  },
  
  // Checks if a given jQuery element is currently readonly.
  _hasReadonly: function(el){
    // Anyone up for a game of 'Count the bloody IE hacks'?
    for(i in this._elementsBound){ if(this._elementsBound[i].el == el[0]) return true; }
    return false;
    // Could have been...
    //return (this._elementsBound.indexOf(el[0]) != -1);
  },
  
  // 'Push' a jQuery element to the list of elements currently readonly.
  _pushElement: function(el){
    var o = this._getDimensions(el);
    this._elementsBound.push({el:el[0], x:o.left, y:o.top, w:o.width, h:o.height});
  },
  
  // 'Pop', or remove, a jQuery element from the list of elements currently readonly.
  _popElement: function(el){
    // If you're playing the game, I guess one every ~30 lines of code so far isn't too bad...
    for(i in this._elementsBound){ if(this._elementsBound[i].el == el[0]){ delete this._elementsBound[i]; return; } }
    //delete this._elementsBound[this._elementsBound.indexOf(el[0])];
  },
  
  // Update a jQuery element's overlay position, useful for window resizing and
  //  initial setting on the element.
  _updateOverlay: function(el){
    var overlay = jQuery(el.next());
    var d = this._getDimensions(el);
    overlay.css('position', 'absolute').css('top', d.top).css('left', d.left).css('width', d.width).css('height', d.height).css('z-index', '100');
  },
  
  // Internally used event listener to deny 'tabbing' to an element.
  //  Fired off whenever the 'focus' event is triggered on a readonly element.
  bindUnfocus: function(e){ $(e.currentTarget).blur(); },
  
  // Main function to set an overlay on an element.
  //  Will handle all the internals such as internal indexing, positioning, etc...
  setOverlay: function(el){
    
    var isReadonly = this._hasReadonly(el);
    
    if(isReadonly){
      this._updateOverlay(el);
      return; // Nothing else needs to be done.
    }
    
    var overlay = jQuery('<div class="readonly_overlay"></div>');
    this._pushElement(el);
    el.bind('focus', this.bindUnfocus).after(overlay);
    this._updateOverlay(el);
    // IE version 6 was so wonderful.... wasn't it?.....
    // @see http://blogs.msdn.com/ie/archive/2006/01/17/514076.aspx
    var ieHack = (el[0].tagName == 'SELECT' && jQuery.browser.version == '6.0' && jQuery.browser.msie)? true : false;
    if(ieHack) el.css('visibility', 'hidden');
  },
  
  // Main function to unset an overlay from an element.
  //  Will handle all the internals such as internal indexing, positioning, etc...
  unsetOverlay: function(el){
    var isReadonly = this._hasReadonly(el);
    if(!isReadonly) return; // Yayz, nothing needs updating as it's not attached to begin with.
    
    var overlay = jQuery(el.next());
    overlay.remove();
    el.unbind('focus', this.bindUnfocus);
    
    this._popElement(el);
    
    // IE version 6 was so wonderful.... wasn't it?.....
    // @see http://blogs.msdn.com/ie/archive/2006/01/17/514076.aspx
    var ieHack = (el[0].tagName == 'SELECT' && jQuery.browser.version == '6.0' && jQuery.browser.msie)? true : false;
    if(ieHack) el.css('visibility', 'visible');
  },
    
  
  // KEEP THIS THE LAST ELEMENT
  //  It's a trick to prevent the final-comma error in IE.
  _dummy: false
};


(function(jQuery) {

  jQuery.extend(jQuery.fn, {
    // jQuery wrapper around the global handler object.
    readonly : function(status) {
      
      // Init the global object if not already, can be called multiple times.
      window.com_powelltechs_readonly.init();
      
      // If no status was given, set it to true.
      if (status == undefined) status = true;
      
      // Run through each element given in by the programmer.
      jQuery(this).each(function(){
        var el = jQuery(this);
        if(status) window.com_powelltechs_readonly.setOverlay(el);
        else window.com_powelltechs_readonly.unsetOverlay(el);
      });
      return this;
    }
  });
})(jQuery);

/* END OF FILE jquery.readonly */
