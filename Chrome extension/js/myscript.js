/*
 * Subtitles For Youtube
 *
 * Created by Yash Agarwal
 * Copyright (c) 2014 Yash Agarwal. All rights reserved.
 *
 */

var subBubblesVideo;
  /* Store display status for subs */
var areSubtitlesShowing = true;
/* Store sub delay in seconds. could be negative or positive */
var subtitlesSync = 0.0;
/* Timer for display sub-info span */
var subInfoDisplayTimer;
/* Font size of subtitles in px */
var subtitlesSize = "";
/* Help message for subtitles */
var shortcutsMessage =  "Subtitles Shortcuts\\n\\n" +
                        "V : Show/Hide \\n" +
                        "G : -50ms delay \\n" +
                        "H : +50ms delay \\n" +
                        "Q : decrease font size \\n" +
                        "W : increase font size";

var autoLoad = false;
var subLanguage = "";
var tag = "";
var originalTag = "";
var originalUrl = "";

initDataFromLocalStorage();

/* Function used to initliaze extension */
function initExtension() {

  /*sub-message is used to show status about upload status of subtitle file
  It appears just below the youtube video */
  // $("#watch7-content").prepend("<div id='subitle-container-first' class='yt-card yt-card-has-padding'><span id='sub-message'></span><a id='sub-open-search-btn'> or Search Subtitles</a></div>");

  if ($("video").length === 0) {
    console.log("Flash video found. Return");
    $("#sub-message").html("This youtube video runs on Adobe Flash." + "Adding subtitles is not supported for it yet.");
    $("#sub-message").fadeOut(3000);
    $("#sub-open-search-btn").css("display", "none");
  } else {
    /* sub-info is used to display information about subs
     * like sync delay or enabled/disabled status.
     * It appears inside youtube video just above the controls toolbar */
    // $("#sub-message").html("Drag and drop SRT or Zipped srt file here to add subtitles to video");
    $("#srt-upload-name").html("Click or drag & drop subtitle file here");
    $('video').attr('id', 'sub-video');
    // $("#sub-video").after("<span id='sub-info'></span>");
    // $('#subitle-container-first').after('<input id="fileupload" type="file" name="uploadFile" style="display:none"/>');
    // $('#fileupload').after("<div id='sub-open-subtitles' style='display:none' class='yt-card yt-card-has-padding'><div>");

    $('#watch-action-panels').after("<div id='new-subtitles-con' style='display:none; position: relative;' class='watch-action-panels yt-uix-button-panel hid yt-card yt-card-has-padding'><div>");
    $('.yt-uix-button.action-panel-trigger-share').after('<button id="subtitle-button" class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon action-panel-trigger-subtitle" type="button" onclick=";return false;" data-button-toggle="true"><span style="margin-right:9px;"><img src="'+ chrome.extension.getURL("images/subtitles_icon.svg")+'" width="18px"></span><span class="yt-uix-button-content">Subtitles</span></button>');

    $("#new-subtitles-con").load(chrome.extension.getURL("subtitles-tab.html"), function() {
      registerEvents();

      $(".subtitles").css("font-size", subtitlesSize + "px");
      $("#subtitles-auto-load").prop('checked', autoLoad);
      $("#sub-language").val(subLanguage);

      if (autoLoad) {
        $("#subtitle-button").click();
      }
    });
  }
}

var pageHref;
var initExtensionInProcess = false;
setInterval(function() {
  if (window.location.href.indexOf("watch") > -1) {
    if (!pageHref || pageHref != window.location.href) {
        console.log("Found video page. Starting extension");
        pageHref = window.location.href;
        if (!initExtensionInProcess) {
          initExtensionInProcess = true;
          setTimeout(function() {
            if (!autoLoad) {
              $('.subtitles').css("display", "none");
            }
            initExtension();
            initExtensionInProcess = false;
          }, 1000);
        }
    }
  }
}, 1000);

setInterval(function() {
  var newTag = $('.ytp-title-link.yt-uix-sessionlink').text().trim().split('.').join(' ');
  var newUrl = $('.ytp-title-link.yt-uix-sessionlink').attr("href");
  if (newTag && newUrl && $("#subtitle-button").length) {
    if (newUrl != originalUrl) {
      console.log("Playing a new video with url: " + newUrl + " and tag: " + newTag);
      originalTag = newTag;
      originalUrl = newUrl;
      tag = newTag;
      if (autoLoad) {
        $('.subtitles').css("display", "block");
        $("#subtitle-button").click();
      }
    }
  }
}, 1000);