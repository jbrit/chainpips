// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ChainPips is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _positionIds;

    enum TradeType {
        Buy,
        Sell
    }

    struct Position {
        uint256 id;
        address trader;
        uint256 amount;
        uint256 entryPrice;
        uint256 entryTime;
        uint256 exitPrice;
        uint256 exitTime;
        TradeType tradeType;
        address tradingPair;
    }

    // storage variables
    mapping(uint256 => Position) public positions;
    mapping(address => bool) public isPair;
    ERC20 public USDPEG;

    
    // events
    event Trade(address trader, uint256 amount, TradeType indexed _type, uint256 entryPrice, uint256 entryTime, uint256 id);
    event TradeClosed(uint256 exitPrice, uint256 exitTime, uint256 id, int256 profit);

    constructor(address _usdpeg) {
        USDPEG = ERC20(_usdpeg);
    }

    function openTrade(TradeType _type, uint256 _amount, address _tradingPair) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(isPair[_tradingPair], "Trading pair not supported");
        // validate user has that amount and transfer it to the contract


        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(_tradingPair).latestRoundData();

        uint256 newId = _positionIds.current();
        positions[newId] = Position({
            id: newId,
            trader: msg.sender,
            amount: _amount,
            entryTime: block.timestamp,
            tradingPair: _tradingPair,
            // get entry from oracles
            entryPrice: uint256(price),
            tradeType: _type,
            // to be set on close
            exitPrice: 0,
            exitTime: 0
        });
        emit Trade(msg.sender, _amount, _type, 0, block.timestamp, newId);
        _positionIds.increment();
    }

    function closeTrade(uint256 _id) public {
        require(positions[_id].trader == msg.sender, "Only the trader can close the trade");
        require(positions[_id].exitTime == 0, "Trade already closed");
        
        // get exit price from oracle based on trading pair
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(positions[_id].tradingPair).latestRoundData();
        positions[_id].exitPrice = uint256(price);
        positions[_id].exitTime = block.timestamp;

        // calculate profit/loss based on trade type, and transfer to trader
        int256 profit = 0;
        profit = (int256(positions[_id].exitPrice) - int256(positions[_id].entryPrice)) * int256(positions[_id].amount);
   
        if (positions[_id].tradeType == TradeType.Sell) {
            profit = profit * -1;
        }
    


        // interaction
        emit TradeClosed(0, block.timestamp, _id, profit);
    }


    function getPositionCount() public view returns (uint256) {
        return _positionIds.current();
    }

    function getPosition(uint256 _id) public view returns (Position memory) {
        return positions[_id];
    }

    function addPair(address _pair) public onlyOwner {
        isPair[_pair] = true;
    }

    function removePair(address _pair) public onlyOwner {
        isPair[_pair] = false;
    }

    receive() external payable {}
}
