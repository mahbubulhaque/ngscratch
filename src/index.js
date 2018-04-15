
var webObj = window.web3;
var accountAddress = window.web3.eth.accounts;

if ( accountAddress ) {
    var balance = window.web3.eth.getBalance(accountAddress, function(error, result){
        if(!error) {
            console.log(JSON.stringify(result));
            balance = result;
            document.getElementById('balance').value = balance;
        }
        else {
            // console.error(error);
            document.getElementById('balance').value = 'an error occured while getting balance';
        }
    });
}

console.log('eth account address: ' + accountAddress);

console.log('balance: ' + balance);
document.getElementById('accAdd').value = accountAddress;
document.getElementById('balance').value = balance;
