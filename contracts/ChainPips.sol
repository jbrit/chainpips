// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ChainPips {
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
    ERC20 public USDPEG;

    
    // events
    event Trade(address trader, uint256 amount, TradeType indexed _type, uint256 entryPrice, uint256 entryTime, uint256 id);
    event TradeClosed(uint256 exitPrice, uint256 exitTime, uint256 id);

    constructor(address _usdpeg) {
        USDPEG = ERC20(_usdpeg);
    }

    function openTrade(TradeType _type, uint256 _amount, address _tradingPair) public {
        require(_amount > 0, "Amount must be greater than 0");
        // validate user has that amount and transfer it to the contract
        // validate trading pair later and get price
        uint256 newId = _positionIds.current();
        positions[newId] = Position({
            id: newId,
            trader: msg.sender,
            amount: _amount,
            entryTime: block.timestamp,
            tradingPair: _tradingPair,
            // get entry from oracles
            entryPrice: 0,
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
        // calculate profit/loss based on trade type, and transfer to trader
        positions[_id].exitPrice = 0;
        positions[_id].exitTime = block.timestamp;

        // interaction

        emit TradeClosed(0, block.timestamp, _id);
    }


    function getPositionCount() public view returns (uint256) {
        return _positionIds.current();
    }

    function getPosition(uint256 _id) public view returns (Position memory) {
        return positions[_id];
    }

    receive() external payable {}
}
