// SPDX-License-Identifier: MIT LICENSED
pragma solidity ^0.8.8;

/* This contract is about sending your ETH to the BANK(contract) and retieve when you need or 
   you can send to someone
   function:
   payment
   withdraw
   send_to
   View_deposited amount
   loan:
*/
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "./PriceConverter.sol";


error NoBalance();
error InsufficientBalance();
error  NotProvdingLoan();
error  YouHavePayedLoan();
error Blocked();

contract BankingAmount is AutomationCompatibleInterface {
    using PriceConverter for uint256;
    address private immutable i_OwnerAddress;
    uint256 public BankTotalMoney;
    address public contractOwner;
    uint256 public immutable i_interval;
    uint256 public lastTimeStamp;
    uint256 public loanIndex;
    uint256 public i=0;
    uint256 public loanCount=0;
    uint256 public currentTime=0;
    bool public up;
    
    struct Custmers {
        address CustmerAddress;
        uint256 amount;
    }
    
    struct peopleLoanDetails{
        address CustmerAddress;
        uint256 loanAmount;
        uint256 timestampLoan;
        bool loanStatus;
        bool blockStatus;  //true==blocked false ==not blocked
    }
    struct BlockedListPeople {
        address blockedAddress;
        uint256 remainingAmount;
    }
    enum loan {ON,OFF}
    
    loan public status;
    AggregatorV3Interface public PriceFeed;
    
    constructor(address PriceFeedAddress,uint256 interval) {
        contractOwner = msg.sender;
        PriceFeed = AggregatorV3Interface(PriceFeedAddress);
        i_interval=interval;
        status=loan.OFF;
        i_OwnerAddress=msg.sender;
    }

    Custmers[] public people;
    peopleLoanDetails[] public peopleLoan;
    BlockedListPeople[] public blockedpeople;

    mapping(address => uint256) public Balance;
    mapping(address => bool) public loanMapping;
    mapping(address => uint256) public loanAmountMapping;
    mapping(address => uint256) public blockedPeople;


    function payment() public payable {
        people.push(
            Custmers(msg.sender, msg.value.getConversionRate(PriceFeed))
        );
        Balance[msg.sender] =
            Balance[msg.sender] +
            msg.value.getConversionRate(PriceFeed);
        BankTotalMoney = Balance[msg.sender];
    }

    function ViewAmount() public view returns (uint256) {
        return Balance[msg.sender];
    }
    function BankTotalAmount() public view returns(uint256){
        return address(this).balance;
    }

    function send_from_BankAccount(address payable to_receiever,uint256 value) public {
        address from_user = msg.sender;
        // (bool sent, ) = payable(to_receiever).call{
        //     value: msg.value
        // }("");
        // require(sent, "Failed to send Ether");
        to_receiever.transfer(value);
        // Balance[to_receiever] = Balance[to_receiever] + Balance[from_user];
        Balance[from_user] = Balance[from_user] - value;
    }

    function withDraw(uint256 value) public {
        address withdraw = msg.sender;
        if (Balance[withdraw] == 0) revert NoBalance();
        if(blockedPeople[msg.sender]!=0) revert Blocked();
        // (bool sent, ) = payable(withdraw).call{value: msg.value}("");
        // require(sent, "Failed to withdraw Ether");
        payable(withdraw).transfer(value);
        Balance[withdraw] = Balance[withdraw] - value;
    }

    function LOAN(uint256 RequestedLoanValue) public {
        // if (BankTotalMoney > RequestedLoanValue.getConversionRate(PriceFeed))
        //     revert InsufficientBalance();
        // if(address(this).balance<)
        if(blockedPeople[msg.sender]!=0) revert Blocked();
        address withdraw = msg.sender;
        payable(withdraw).transfer(RequestedLoanValue);
        loanCount=loanCount+1;//
        BankTotalMoney = BankTotalMoney - RequestedLoanValue;
        lastTimeStamp=block.timestamp;
        peopleLoan.push(peopleLoanDetails(msg.sender,RequestedLoanValue,lastTimeStamp,false,false));
        loanMapping[msg.sender]=false;
        loanAmountMapping[msg.sender]=RequestedLoanValue;
        status=loan.ON;
        checkUpkeep("");
    }

    function PayLoan() public payable{
        if(loanMapping[msg.sender]!=false) revert YouHavePayedLoan();  
        payable(i_OwnerAddress).transfer(loanAmountMapping[msg.sender]);
        loanMapping[msg.sender]=true;
        peopleLoan[peopleLoan.length-1].loanStatus=true;
        }

    function checkUpkeep(
        bytes memory /*checkData*/
    ) public override returns (bool upkeepNeeded, bytes memory /*performData*/) {
        // loanCount=loanCount+1; 
        if(status == loan.OFF) revert NotProvdingLoan();
        // for(uint256 i=0;i<=peopleLoan.length-1;i++)
            loanIndex=i;
            currentTime=block.timestamp;
            if(peopleLoan[i].blockStatus==true || peopleLoan[i].loanStatus ==true){
                i++;
                loanIndex++;
            }
            upkeepNeeded = (
                ((block.timestamp - peopleLoan[i].timestampLoan) > i_interval)
                && !peopleLoan[i].loanStatus 
                && !peopleLoan[i].blockStatus
            );
            up=upkeepNeeded;
            return (upkeepNeeded, "0x0");
        
    }

    function performUpkeep(bytes calldata performData) external override {
        //  (((block.timestamp - lastTimeStamp) > i_interval) && !peopleLoan[peopleLoan.length-1].loanStatus);
        blockedpeople.push(BlockedListPeople(
            peopleLoan[loanIndex].CustmerAddress,
            peopleLoan[loanIndex].loanAmount)
        );
        peopleLoan[loanIndex].blockStatus=true;
        blockedPeople[peopleLoan[loanIndex].CustmerAddress]=peopleLoan[loanIndex].loanAmount;
    }
}