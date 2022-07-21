
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./AddressSet.sol";

contract TronVoice {

    using AddressSet for AddressSet.Set;

    uint accountCreationCost =  1_000_000; //  1 TRX - fee to create an account
    uint postCost =             1_000_000; //  1 TRX - needed to create a post
    uint likeCost =            10_000_000; // 10 TRX - this is send to the owner of the post
    
    mapping(address => Account) accounts;
    
    // Stored like this
    struct Account {
        address payable owner;
        uint created;
        string name;
        string image;
        string url;
        uint totalLikes;
        uint[] postIds;
    }
    
    Post[] posts;
    struct Post {
        address owner;
        string text;
        uint date;
        uint likes;

        uint replyTo;
        uint[] replies;
    }

    // API output
    struct AccountInfo {
        string name;
        uint created;
        string image;
        string url;
        uint totalLikes;
        uint postsCount;
    }

    struct PostInfo {
        address owner;
        string text;
        uint date;
        uint likes;

        uint replyTo;
        uint replyCount;
    }

    // --------------------------- setup

    address payable contractOwner;
    constructor(address payable _contractOwner) {
        require(_contractOwner != address(0));
        contractOwner = _contractOwner;
    }

    // withdraw allows the owner to transfer out the balance of the contract.
    function withdraw() public {
        require(msg.sender == contractOwner);
        contractOwner.transfer(address(this).balance);
    }

    function setAccountCost(uint _accountCreationCost) public {
        require(msg.sender == contractOwner);
        accountCreationCost = _accountCreationCost;
    }
    function setLikeCost(uint _likeCost) public {
        require(msg.sender == contractOwner);
        likeCost = _likeCost;
    }
    function setPostCost(uint _postCost) public {
        require(msg.sender == contractOwner);
        postCost = _postCost;
    }

    // --------------------------- view functions

    function postsCount() public view returns (uint) {
        return posts.length;
    }

    function getAccountInfo(address owner) public view returns (AccountInfo memory accountInfo) {
        Account storage account = accounts[owner];
        accountInfo = AccountInfo(
            account.name,
            account.created,
            account.image,
            account.url,
            account.totalLikes,
            account.postIds.length
        );
    }

    function getLastestPost(address owner) public view returns (PostInfo memory postInfo) {
        Account storage account = accounts[owner];
        uint lastPostId = account.postIds[account.postIds.length - 1];
        Post storage lastPost = posts[lastPostId];
        postInfo = PostInfo(
            lastPost.owner,
            lastPost.text,
            lastPost.date,
            lastPost.likes,
            lastPost.replyTo,
            lastPost.replies.length
        );
    }

    function get5PostIds(address owner, int offset) public view returns (uint[] memory postIds) {
        Account storage account = accounts[owner];
        int endElement = int(account.postIds.length) - offset;
        uint max = endElement >= 5 ? 5 : uint(endElement);
        uint start = uint(endElement) - max;

        postIds = new uint[](5);
        for (uint i = 0; i < max;) {
            postIds[i] = account.postIds[start + i];
            unchecked{ i++; }
        }
    }

    function getPost(uint postId) public view returns (PostInfo memory postInfo) {
        Post storage post1 = posts[postId];
        postInfo = PostInfo(
            post1.owner,
            post1.text,
            post1.date,
            post1.likes,
            post1.replyTo,
            post1.replies.length
        );
    }

    function getReplies(uint postId) public view returns (uint256[] memory replies) {
        require(postId != 0);
        Post storage post1 = posts[postId];
        replies = post1.replies;
    }

    // --------------------------- non-view functions

    function setAccount(string memory name, string memory image, string memory url) public payable {
        require(bytes(name).length < 200);
        require(bytes(image).length < 1000);
        require(bytes(url).length < 1000);
        Account storage account = accounts[msg.sender];
        if (account.created == 0) { // account creation
            require(msg.value >= accountCreationCost);
            account.owner = payable(msg.sender);
            account.created = block.timestamp;
        }
        account.name = name;
        account.image = image;
        account.url = url;
    }

    function post(string memory text, uint replyTo) public payable {
        require(msg.value >= postCost);
        require(bytes(text).length < 280);
        uint postId = posts.length;
        uint[] memory replies;
        Post memory newPost = Post(msg.sender, text, block.timestamp, 0, replyTo, replies);
        posts.push(newPost);

        if (replyTo != 0) {
            Post storage repliedPost = posts[replyTo];
            repliedPost.replies.push(postId);
        }
        
        Account storage account = accounts[msg.sender];
        account.postIds.push(postId);
    }

    function deletePost(uint postId) public payable {
        Account storage account = accounts[msg.sender];
        require(msg.sender == account.owner);
        Post storage post1 = posts[postId];
        post1.text = '';
    }

    function like(uint postId) public payable {
        require(msg.value >= likeCost);
        Post storage likedPost = posts[postId];
        likedPost.likes += 1;
        Account storage account = accounts[likedPost.owner];
        account.totalLikes += 1;

        // send the like cost directly to the owner
        account.owner.transfer(likeCost);
    }
    
}