//assigns an animated class to the donate now button
function setButtonPressed() {
    //#the-button: donate now button
    //.donation-button-pressed: css keyframe animation
    $('#the-button').addClass('donation-button-pressed');
    $('#the-button').text('');
    $('#the-button').css('width', '0%');
}
