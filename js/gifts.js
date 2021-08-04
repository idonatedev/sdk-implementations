//gift functions

//set up user interface
document.addEventListener('DOMContentLoaded',function(){
    updateGiftsAvailable(); //set initial gift roster state
    
    $('#paymentAmount').on('change', function(){
        updateGiftsAvailable();
    });

    $('#gift-opt-out').on('click', function(){
        if($('#gift-opt-out').prop('checked') == true){
            $('#gl1').prop('checked',false);
            $('#gl2').prop('checked',false);
            $('#gl3').prop('checked',false);
        }
    });

    //if radial is selected, uncheck box
    $('#gl1').on('click', function(){$('#gift-opt-out').prop('checked',false)});
    $('#gl2').on('click', function(){$('#gift-opt-out').prop('checked',false)});
    $('#gl3').on('click', function(){$('#gift-opt-out').prop('checked',false)});
})

//grey out levels below current paymentAmount value.
function updateGiftsAvailable(){

    var currentLevel = parseFloat($('#paymentAmount').val());
    
    //set inactives
    if(currentLevel < giftLevels.level3){
        $('#gift-level-3').addClass('gift-inactive');
        $('#gi3').addClass('gift-inactive');
        $('#gl3').prop('checked',false);
        
    }
    if(currentLevel < giftLevels.level2){
        $('#gift-level-2').addClass('gift-inactive');
        $('#gi2').addClass('gift-inactive');
        $('#gl2').prop('checked',false);
    }
    if(currentLevel < giftLevels.level1){
        $('#gift-level-1').addClass('gift-inactive');
        $('#gi1').addClass('gift-inactive');
        $('#gl1').prop('checked',false);
    }

    //set actives
    if(currentLevel >= giftLevels.level1){
        $('#gift-level-1').removeClass('gift-inactive');
        $('#gi1').removeClass('gift-inactive');
    }
    if(currentLevel >= giftLevels.level2){
        $('#gift-level-2').removeClass('gift-inactive');
        $('#gi2').removeClass('gift-inactive');
    }
    if(currentLevel >= giftLevels.level3){
        $('#gift-level-3').removeClass('gift-inactive');
        $('#gi3').removeClass('gift-inactive');
    }
}
