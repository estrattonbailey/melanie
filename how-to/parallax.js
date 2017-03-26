// JavaScript Document

$(document).ready(function(){

//Parallax Events

$(window).bind('scroll', function(e){

parallax();

});

$('a.home').click(function() {

$('html, body').animate({ scrollTop:0 }, 1000,

function() {

parallax();

});

return false;

});

$('a.dress').click(function() {

$('html, body').animate({ scrollTop:$('#dress').offset().top }, 1000,

function() {

parallax();

});

return false;

});

$('a.speak').click(function() {

$('html, body').animate({ scrollTop:$('#speak').offset().top }, 1000,

function() {

parallax();

});

return false;

});

$('a.cook').click(function() {

$('html, body').animate({ scrollTop:$('#cook').offset().top }, 1000,

function() {

parallax();

});

return false;

});

$('a.clean').click(function() {

$('html, body').animate({ scrollTop:$('#clean').offset().top }, 1000,

function() {

parallax();

});

return false;

});

$('a.poo').click(function() {

$('html, body').animate({ scrollTop:$('#poo').offset().top }, 1000,

function() {

parallax();

});return false;

});

$('a.tennis').click(function() {

$('html, body').animate({ scrollTop:$('#tennis').offset().top }, 1000,

function() {

parallax();

});

return false;

});

});

//Parallax Function

function parallax(){

var scrollPosition = $(window).scrollTop();

$('#images').css('top', (0 - (scrollPosition*.5)) + 'px'); // For the images

$('#images2').css('top', (0 - (scrollPosition*.75)) + 'px'); //For the images 

$('#images3').css('top', (0 - (scrollPosition*.5)) + 'px'); // For the images


}// JavaScript Document