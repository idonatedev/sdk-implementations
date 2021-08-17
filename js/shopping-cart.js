/*
    SHOPPING CART FUNCTIONS
*/

function addSummaryItem(summaryElement){
    //adds an element to the item summary area.  updates data.

    $('.item-summary').append(summaryElement);
    recalculate();
}

function deleteHandler(domId){
    console.log('delete handler called.');
    $('#' + domId).remove();
    recalculate();
}

function recalculate(){
    console.log('recalculating totals...');

    var sumOfSummaryElements = 0;

    for(i = 0; i < $('.item-summary')[0].children.length; i++){
        sumOfSummaryElements += parseFloat($('.item-summary')[0].children[i].children[0].children[2].innerHTML);
    }

    // if sum 0, disable checkout, if not, enable
    if(sumOfSummaryElements == 0){
        console.log("(sumOfSummaryElements == 0");
        $('#checkout-button').addClass('checkout-button-inactive');
    }else if(sumOfSummaryElements > 0){
        console.log("(sumOfSummaryElements > 0");
        $('#checkout-button').removeClass('checkout-button-inactive');
    }else{
        console.log('test for weird logic');
    }

    if($('#dpf-checkbox-element').prop("checked") == true){
        console.log('dpf checkbox checked == true.');
        var dpfAmount = sumOfSummaryElements * theData.dpfPercentage;
        theData.dpfActive = true;
        theData.donorPaidFeeAmount = dpfAmount;
        sumOfSummaryElements += dpfAmount;
    }else{
        theData.donorPaidFeeAmount = 0;
    }

    console.log('== total: ' + sumOfSummaryElements);

    $('#total-text').html(sumOfSummaryElements);
}

function disableButtonEvents(){
    $('#dpf-checkbox-element').addClass('dpf-disabled');
    $('#checkout-button').addClass('checkout-events-disabled');
    $('.item-checkout-delete').addClass('item-delte-events-disabled');
    $('.add-item-button').addClass('add-item-events-disabled');
}

function enableButtonEvents(){
    $('#dpf-checkbox-element').removeClass('dpf-disabled');
    $('#checkout-button').removeClass('checkout-events-disabled');
    $('.item-checkout-delete').removeClass('item-delte-events-disabled');
    $('.add-item-button').removeClass('add-item-events-disabled');
}

function createDesignationArray(){
    //takes the data in .item-summary and outputs an object with {id,amt}[] schema
    var designationArray = [];

    for(i = 0; i < $('.item-summary')[0].children.length; i++){
        var amt = parseFloat($('.item-summary')[0].children[i].children[0].children[2].innerHTML);
        var des = $('.item-summary')[0].children[i].attributes['designation-id'].value;
        designationArray.push({
            id: des,
            amount: amt
        });
    }

    return designationArray;
}

function createNewSummaryItem(domId){
    console.log('creating new summary item from id ' + domId);

    var theDiv = $('#' + domId);
    console.log(theDiv);
    
    var summaryData = {
        designation: theDiv[0].attributes['designation-id'].value,
        description: theDiv[0].attributes['desc'].value,
        price: theDiv[0].attributes['price'].value,
    };

    var checkoutItemContainer = document.createElement('div');
    checkoutItemContainer.classList.add('checkout-item-container');
    checkoutItemContainer.id = 'del-' + domId; //used for delete target
    checkoutItemContainer.setAttribute('designation-id', summaryData.designation);

    var itemCheckoutSummary = document.createElement('div');
    itemCheckoutSummary.classList.add('item-checkout-summary');

    var itemQuantity = document.createElement('div');
    itemQuantity.classList.add('item-quantity');
    itemQuantity.innerHTML = 1;

    var itemCheckoutDescription = document.createElement('div');
    itemCheckoutDescription.classList.add('item-checkout-desc');
    itemCheckoutDescription.innerHTML = summaryData.description;

    var itemCheckoutAmount = document.createElement('div');
    itemCheckoutAmount.classList.add('item-checkout-amt');
    itemCheckoutAmount.innerHTML = summaryData.price;

    var itemCheckoutDelete = document.createElement('div');
    itemCheckoutDelete.classList.add('item-checkout-delete');

    var itemCheckoutDeleteButton = document.createElement('button');
    itemCheckoutDeleteButton.classList.add('item-checkout-delete-button');
    itemCheckoutDeleteButton.setAttribute('type','button');
    itemCheckoutDeleteButton.innerHTML = 'X';
    itemCheckoutDeleteButton.setAttribute('onclick', "deleteHandler('del-" + domId + "')");

    itemCheckoutDelete.appendChild(itemCheckoutDeleteButton);

    checkoutItemContainer.appendChild(itemCheckoutSummary);

    itemCheckoutSummary.appendChild(itemQuantity);
    itemCheckoutSummary.appendChild(itemCheckoutDescription);
    itemCheckoutSummary.appendChild(itemCheckoutAmount);
    itemCheckoutSummary.appendChild(itemCheckoutDelete);

    addSummaryItem(checkoutItemContainer);
}

function addQuantity(domId){
    var currentAmount = parseFloat($('#del-' + domId)[0].children[0].children[0].innerHTML);
    currentAmount += 1;
    $('#del-' + domId)[0].children[0].children[0].innerHTML = currentAmount;

    var currentPrice = parseFloat($('#del-' + domId)[0].children[0].children[2].innerHTML);
    currentPrice += parseFloat($('#' + domId)[0].attributes['price'].value);
    $('#del-' + domId)[0].children[0].children[2].innerHTML = currentPrice;

    recalculate();
}

function createSummaryFromId(domId){

    if($('.item-summary')[0].children.length == 0){
        createNewSummaryItem(domId);
        
        return 0;
    }

    var included = false;

    for(i = 0; i < $('.item-summary')[0].children.length; i++){
        //console.log("xx $('.item-summary')[0].children[i].id: " + $('.item-summary')[0].children[i].id);
        if($('.item-summary')[0].children[i].id == 'del-' + domId){
            //included.
            console.log('++included: ' + domId);
            included = true;
            addQuantity(domId);
        }
    }

    if(included == false){
        //not included.
        console.log('--not included: ' + domId);
        createNewSummaryItem(domId);
    }
}

function checkoutHandler(){
    $('.form-area').css('display','block');
    disableButtonEvents();
}

function closeCheckout(){
    $('.form-area').css('display','none');
    enableButtonEvents();
}

function renderReceiptElements(dataIn){
    console.log('rendering receipt elements.');
    
    $('#receipt-name-text').text("" + dataIn._raw_response.donor.contact.firstname + " " + dataIn._raw_response.donor.contact.lastname);
                
    //date
    var date = new Date();
    var mmddyyyy = [
        String(date.getMonth() + 1),
        String(date.getDate()),
        String(date.getFullYear())
    ];
    var dateText = "" +  mmddyyyy[0] + '/' + mmddyyyy[1] + '/' + mmddyyyy[2];
    $('#receipt-date-text').text("" + dateText);
    
    //amount
    $('#receipt-gift-text').text("$" + dataIn._raw_response.transaction.total_value);
    
    //transaction id
    $('#receipt-transactionID-text').text("" + dataIn.transactionId);
    
    //truncated card
    $('#receipt-card-text').text("" + theData.truncatedCardData);

    //set initial form to invisible
    $('.form-area').addClass('form-complete');
    $('.form-area').css('display','none'); //for some reason, addClass doesn't do the trick, so...
   
    //set receipt to visible
    $('.receipt-area').css('display','block');
}

function closeReceipt(){
    //hide receipt area
}

function handleTheError(e){
    console.log(e);
    return 0;
}