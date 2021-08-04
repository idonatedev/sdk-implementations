//displays error message in dom element .error-text

function handleTheError(e) {
    $('.error-text').text('' + e);
    $('.error-text').addClass('error-text-active');
}